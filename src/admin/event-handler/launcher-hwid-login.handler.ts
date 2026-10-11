import { Logger } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { In, MoreThan, Repository } from "typeorm";
import { RedlockService } from "@dota2classic/redlock/dist/redlock.service";
import { LauncherHwidLoginEvent } from "../../auth/event/launcher-hwid-login.event";
import { SteamidHwidEntryEntity } from "../../database/entities/steamid-hwid-entry.entity";
import { PlayerFlagsEntity } from "../../database/entities/player-flags.entity";
import { TelegramNotificationService } from "../../notification/telegram-notification.service";
import { UserProfileService } from "../../service/user-profile.service";
import { RuleEntity } from "../../database/entities/rule.entity";
import { ReportService } from "../../report/report.service";
import { PlayerBanEntity } from "../../database/entities/player-ban.entity";
import { ForumApi } from "../../generated-api/forum";
import { fullDate } from "../../utils/format-date";
import { UNKNOWN_HWID } from "../smurf-links.service";
import {
  ActiveBan,
  decideHwidLogin,
  reasonName,
} from "./launcher-hwid-login.decision";

@EventsHandler(LauncherHwidLoginEvent)
export class LauncherHwidLoginHandler
  implements IEventHandler<LauncherHwidLoginEvent>
{
  private readonly logger = new Logger(LauncherHwidLoginHandler.name);

  constructor(
    private readonly redlock: RedlockService,
    private readonly config: ConfigService,
    private readonly reports: ReportService,
    private readonly user: UserProfileService,
    private readonly telegram: TelegramNotificationService,
    private readonly forumApi: ForumApi,
    @InjectRepository(SteamidHwidEntryEntity)
    private readonly hwidRepository: Repository<SteamidHwidEntryEntity>,
    @InjectRepository(PlayerFlagsEntity)
    private readonly flagsRepository: Repository<PlayerFlagsEntity>,
    @InjectRepository(RuleEntity)
    private readonly ruleRepository: Repository<RuleEntity>,
    // Same table gameserver reads; one query for all accounts on the computer
    @InjectRepository(PlayerBanEntity)
    private readonly banRepository: Repository<PlayerBanEntity>,
  ) {}

  async handle(event: LauncherHwidLoginEvent) {
    if (!event.hwid || event.hwid === UNKNOWN_HWID) return;
    try {
      // The launcher may re-authenticate right after login: two concurrent
      // checks would both see "not banned yet" and punish twice
      await this.redlock.withLock(
        [`hwid-login-check:${event.steamId}`],
        15000,
        () => this.check(event),
      );
    } catch (e) {
      this.logger.error(`HWID check failed for ${event.steamId}`, e);
    }
  }

  private async check({ steamId, hwid, isNewEntry }: LauncherHwidLoginEvent) {
    const others = (
      await this.hwidRepository
        .createQueryBuilder("e")
        .select("DISTINCT e.steam_id", "steam_id")
        .where("e.hwid = :hwid AND e.steam_id <> :steamId", { hwid, steamId })
        .getRawMany<{ steam_id: string }>()
    ).map((r) => r.steam_id);
    if (others.length === 0) return;

    const bannedOthers: ActiveBan[] = (
      await this.banRepository.find({
        where: { steamId: In(others), endTime: MoreThan(new Date()) },
      })
    ).map((b) => ({
      steamId: b.steamId,
      bannedUntil: b.endTime.toISOString(),
      reason: b.reason,
    }));
    if (bannedOthers.length === 0) return;

    const flags = await this.flagsRepository.find({
      where: { steamId: In([steamId, ...bannedOthers.map((b) => b.steamId)]) },
    });
    if (flags.find((f) => f.steamId === steamId)?.ignoreSmurf) return;

    const autoBanSources = new Set(
      flags.filter((f) => f.autoBanHwid).map((f) => f.steamId),
    );

    const rule = autoBanSources.size > 0 ? await this.smurfRule() : undefined;

    const decision = decideHwidLogin({
      ownBan: await this.ownBan(steamId),
      bannedOthers,
      autoBanSources,
      isNewEntry,
      punishmentMs: rule
        ? rule.punishment.durationHours * 60 * 60 * 1000
        : undefined,
      nowMs: Date.now(),
    });

    if (decision.kind === "autoban") {
      const { source } = decision;
      this.logger.log(
        `Auto-ban ${steamId} by rule ${rule.id}: HWID shared with ${source.steamId}`,
      );
      // Same path as a moderator's "guilty" verdict: bans and writes the
      // punishment log, executed by the bot account
      await this.reports.applyPunishment(
        { steamId, ruleId: rule.id },
        this.config.get("api.botSteamId"),
      );
      await this.mute(steamId, rule.punishment.durationHours * 60 * 60 * 1000);
      await this.telegram.notifyHtml(
        `[АВТОБАН ПО HWID]
Аккаунт: ${await this.link(steamId)}
Зашёл с компьютера игрока ${await this.link(source.steamId)} (${reasonName(source.reason)} до ${fullDate(new Date(source.bannedUntil))})
Наказание: ${rule.title} — ${rule.punishment.title}`,
      );
    } else if (decision.kind === "notify") {
      const banned = await Promise.all(
        decision.banned.map(
          async (b) =>
            `- ${await this.link(b.steamId)}: ${reasonName(b.reason)} до ${fullDate(new Date(b.bannedUntil))}`,
        ),
      );
      await this.telegram.notifyHtml(
        `[СМУРФ ПО HWID]
Аккаунт: ${await this.link(steamId)}
Впервые зашёл с компьютера, где есть забаненные аккаунты:
${banned.join("\n")}`,
      );
    }
  }

  // Twins are also muted for the punishment's duration; a longer existing
  // mute is kept. Not logged in the ban log
  private async mute(steamId: string, durationMs: number) {
    try {
      const user = await this.forumApi.forumControllerGetUser(steamId);
      const until = Math.max(
        new Date(user.muteUntil).getTime() || 0,
        Date.now() + durationMs,
      );
      await this.forumApi.forumControllerUpdateUser(steamId, {
        muteUntil: new Date(until).toISOString(),
      });
    } catch (e) {
      this.logger.error(`Failed to mute auto-banned ${steamId}`, e);
    }
  }

  private async smurfRule(): Promise<RuleEntity | undefined> {
    const id = Number(this.config.get("api.smurfRuleId"));
    const rule = await this.ruleRepository.findOne({ where: { id } });
    if (!rule?.punishment) {
      this.logger.error(
        `Smurf rule ${id} or its punishment not found, auto-ban disabled`,
      );
      return undefined;
    }
    return rule;
  }

  private async ownBan(
    steamId: string,
  ): Promise<{ isBanned: boolean; bannedUntil: string }> {
    const ban = await this.banRepository.findOne({ where: { steamId } });
    return {
      isBanned: !!ban && ban.endTime.getTime() > Date.now(),
      bannedUntil: (ban?.endTime ?? new Date(0)).toISOString(),
    };
  }

  private link = async (steamId: string) =>
    `<a href="https://dotaclassic.ru/players/${steamId}">${await this.user.name(steamId)}</a>`;
}
