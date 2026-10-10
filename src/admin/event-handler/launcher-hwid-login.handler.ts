import { Logger } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { ApiClient } from "@dota2classic/gs-api-generated/dist/module";
import { RedlockService } from "@dota2classic/redlock/dist/redlock.service";
import { LauncherHwidLoginEvent } from "../../auth/event/launcher-hwid-login.event";
import { SteamidHwidEntryEntity } from "../../database/entities/steamid-hwid-entry.entity";
import { PlayerFlagsEntity } from "../../database/entities/player-flags.entity";
import { TelegramNotificationService } from "../../notification/telegram-notification.service";
import { UserProfileService } from "../../service/user-profile.service";
import { RuleEntity } from "../../database/entities/rule.entity";
import { ReportService } from "../../report/report.service";
import { asBanReason } from "../../types/gs-api-compat";
import { Role } from "../../gateway/shared-types/roles";
import { fullDate } from "../../utils/format-date";
import { UNKNOWN_HWID } from "../smurf-links.service";
import {
  ActiveBan,
  decideHwidLogin,
  reasonName,
} from "./launcher-hwid-login.decision";

// More accounts than this on one HWID is a computer club or a broken
// (low-entropy) HWID — not something to auto-ban or ping moderators about
const MAX_ACCOUNTS_PER_HWID = 20;

const STAFF_ROLES = new Set([Role.MODERATOR, Role.ADMIN]);

@EventsHandler(LauncherHwidLoginEvent)
export class LauncherHwidLoginHandler
  implements IEventHandler<LauncherHwidLoginEvent>
{
  private readonly logger = new Logger(LauncherHwidLoginHandler.name);

  constructor(
    private readonly gsApi: ApiClient,
    private readonly redlock: RedlockService,
    private readonly config: ConfigService,
    private readonly reports: ReportService,
    private readonly user: UserProfileService,
    private readonly telegram: TelegramNotificationService,
    @InjectRepository(SteamidHwidEntryEntity)
    private readonly hwidRepository: Repository<SteamidHwidEntryEntity>,
    @InjectRepository(PlayerFlagsEntity)
    private readonly flagsRepository: Repository<PlayerFlagsEntity>,
    @InjectRepository(RuleEntity)
    private readonly ruleRepository: Repository<RuleEntity>,
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
    const firstSeen = new Map(
      (
        await this.hwidRepository
          .createQueryBuilder("e")
          .select("e.steam_id", "steam_id")
          .addSelect("MIN(e.created_at)", "first_seen")
          .where("e.hwid = :hwid", { hwid })
          .groupBy("e.steam_id")
          .getRawMany<{ steam_id: string; first_seen: Date }>()
      ).map((r) => [r.steam_id, new Date(r.first_seen).getTime()]),
    );
    const ownFirstSeenMs = firstSeen.get(steamId) ?? Date.now();
    firstSeen.delete(steamId);

    const others = [...firstSeen.keys()];
    if (others.length === 0) return;
    if (others.length > MAX_ACCOUNTS_PER_HWID) {
      this.logger.warn(
        `HWID of ${steamId} is shared by ${others.length} accounts, skipping`,
      );
      return;
    }

    const bannedOthers: ActiveBan[] = (
      await Promise.all(others.map((id) => this.banInfo(id)))
    )
      .filter((b) => b.isBanned)
      .map((b) => ({ ...b, firstSeenMs: firstSeen.get(b.steamId) }));
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
      ownBan: await this.banInfo(steamId),
      ownFirstSeenMs,
      bannedOthers,
      autoBanSources,
      isNewEntry,
      punishmentMs: rule
        ? rule.punishment.durationHours * 60 * 60 * 1000
        : undefined,
      nowMs: Date.now(),
    });

    if (decision.kind === "autoban" && (await this.isStaff(steamId))) {
      this.logger.warn(`Not auto-banning staff account ${steamId}`);
      return;
    }

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

  private async isStaff(steamId: string): Promise<boolean> {
    const user = await this.user.userDto(steamId);
    return user.roles.some((r) => STAFF_ROLES.has(r.role));
  }

  private async banInfo(
    steamId: string,
  ): Promise<Omit<ActiveBan, "firstSeenMs"> & { isBanned: boolean }> {
    const { data } =
      await this.gsApi.player.playerModerationControllerBanInfo(steamId);
    return {
      steamId,
      isBanned: data.isBanned,
      bannedUntil: data.bannedUntil,
      reason: asBanReason(data.status),
    };
  }

  private link = async (steamId: string) =>
    `<a href="https://dotaclassic.ru/players/${steamId}">${await this.user.name(steamId)}</a>`;
}
