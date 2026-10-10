import { Inject, Logger } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ClientProxy } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { ApiClient } from "@dota2classic/gs-api-generated/dist/module";
import { LauncherHwidLoginEvent } from "../../auth/event/launcher-hwid-login.event";
import { SteamidHwidEntryEntity } from "../../database/entities/steamid-hwid-entry.entity";
import { PlayerFlagsEntity } from "../../database/entities/player-flags.entity";
import { TelegramNotificationService } from "../../notification/telegram-notification.service";
import { UserProfileService } from "../../service/user-profile.service";
import { PlayerBanHammeredEvent } from "../../gateway/events/bans/player-ban-hammered.event";
import { PlayerId } from "../../gateway/shared-types/player-id";
import { BanReason } from "../../gateway/shared-types/ban";
import { asBanReason } from "../../types/gs-api-compat";
import { fullDate } from "../../utils/format-date";
import { UNKNOWN_HWID } from "../smurf-links.service";

interface ActiveBan {
  steamId: string;
  bannedUntil: string;
  reason: BanReason;
}

export type HwidLoginDecision =
  | { kind: "none" }
  | { kind: "notify"; banned: ActiveBan[] }
  | { kind: "autoban"; source: ActiveBan };

const until = (b: { bannedUntil: string }) => new Date(b.bannedUntil).getTime();

// Production has reasons missing from the enum (3, 5, 6)
const reasonName = (r: BanReason) => BanReason[r] ?? `reason ${r}`;

/**
 * What to do when an account logs in from a computer where other accounts
 * have active bans:
 * - one of them has the auto-ban flag -> give the account the longest such ban,
 *   unless it already has a ban at least as long;
 * - otherwise tell moderators, but only on the first login from this computer
 *   so a regular player does not spam the chat.
 */
export function decideHwidLogin(
  ownBan: { isBanned: boolean; bannedUntil: string },
  bannedOthers: ActiveBan[],
  autoBanSources: Set<string>,
  isNewEntry: boolean,
): HwidLoginDecision {
  if (bannedOthers.length === 0) return { kind: "none" };

  const source = bannedOthers
    .filter((b) => autoBanSources.has(b.steamId))
    .sort((a, b) => until(b) - until(a))[0];

  if (source) {
    // Never shorten a ban the account already has
    if (ownBan.isBanned && until(ownBan) >= until(source)) {
      return { kind: "none" };
    }
    return { kind: "autoban", source };
  }

  if (ownBan.isBanned || !isNewEntry) return { kind: "none" };
  return { kind: "notify", banned: bannedOthers };
}

@EventsHandler(LauncherHwidLoginEvent)
export class LauncherHwidLoginHandler
  implements IEventHandler<LauncherHwidLoginEvent>
{
  private readonly logger = new Logger(LauncherHwidLoginHandler.name);

  constructor(
    @Inject("QueryCore") private readonly rq: ClientProxy,
    private readonly gsApi: ApiClient,
    private readonly user: UserProfileService,
    private readonly telegram: TelegramNotificationService,
    @InjectRepository(SteamidHwidEntryEntity)
    private readonly hwidRepository: Repository<SteamidHwidEntryEntity>,
    @InjectRepository(PlayerFlagsEntity)
    private readonly flagsRepository: Repository<PlayerFlagsEntity>,
  ) {}

  async handle(event: LauncherHwidLoginEvent) {
    try {
      await this.check(event);
    } catch (e) {
      this.logger.error(`HWID check failed for ${event.steamId}`, e);
    }
  }

  private async check({ steamId, hwid, isNewEntry }: LauncherHwidLoginEvent) {
    if (!hwid || hwid === UNKNOWN_HWID) return;

    const others = (
      await this.hwidRepository
        .createQueryBuilder("e")
        .select("DISTINCT e.steam_id", "steam_id")
        .where("e.hwid = :hwid AND e.steam_id <> :steamId", { hwid, steamId })
        .getRawMany<{ steam_id: string }>()
    ).map((r) => r.steam_id);
    if (others.length === 0) return;

    const bannedOthers: ActiveBan[] = (
      await Promise.all(others.map((id) => this.banInfo(id)))
    ).filter((b) => b.isBanned);
    if (bannedOthers.length === 0) return;

    const flags = await this.flagsRepository.find({
      where: { steamId: In([steamId, ...bannedOthers.map((b) => b.steamId)]) },
    });
    if (flags.find((f) => f.steamId === steamId)?.ignoreSmurf) return;

    const autoBanSources = new Set(
      flags.filter((f) => f.autoBanHwid).map((f) => f.steamId),
    );

    const decision = decideHwidLogin(
      await this.banInfo(steamId),
      bannedOthers,
      autoBanSources,
      isNewEntry,
    );

    if (decision.kind === "autoban") {
      const { source } = decision;
      this.logger.log(
        `Auto-ban ${steamId}: HWID shared with ${source.steamId}, until ${source.bannedUntil}`,
      );
      this.rq.emit(PlayerBanHammeredEvent.name, {
        playerId: new PlayerId(steamId),
        endTime: source.bannedUntil,
        reason: source.reason,
      });
      await this.telegram.notifyHtml(
        `[АВТОБАН ПО HWID]
Аккаунт: ${await this.link(steamId)}
Зашёл с компьютера игрока ${await this.link(source.steamId)}
Бан: ${reasonName(source.reason)} до ${fullDate(new Date(source.bannedUntil))}`,
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

  private async banInfo(
    steamId: string,
  ): Promise<ActiveBan & { isBanned: boolean }> {
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
