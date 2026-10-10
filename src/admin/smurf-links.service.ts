import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ApiClient } from "@dota2classic/gs-api-generated/dist/module";
import { SteamidHwidEntryEntity } from "../database/entities/steamid-hwid-entry.entity";
import { UserProfileService } from "../service/user-profile.service";
import { asBanReason } from "../types/gs-api-compat";
import { SmurfData } from "./dto/admin.dto";

// Value the launcher sends when WMI fails — shared by unrelated players
export const UNKNOWN_HWID = "unknown";

// Every linked account costs a few gameserver calls; shared IPs
// (mobile CGNAT, public VPNs) can link hundreds of accounts.
const MAX_LINKS = 100;
const STATS_CONCURRENCY = 5;

export interface SmurfLink {
  steamId: string;
  sharedHwid: boolean;
  sharedIp: boolean;
}

/**
 * Merges accounts linked by IP (from gameserver) and by HWID (launcher logins).
 * The player himself is excluded. Accounts linked both ways go first, then HWID-only,
 * then IP-only.
 */
export function mergeSmurfLinks(
  steamId: string,
  ipLinked: string[],
  hwidLinked: string[],
): SmurfLink[] {
  const links = new Map<string, SmurfLink>();
  const get = (id: string) => {
    let link = links.get(id);
    if (!link) {
      link = { steamId: id, sharedHwid: false, sharedIp: false };
      links.set(id, link);
    }
    return link;
  };

  ipLinked.forEach((id) => (get(id).sharedIp = true));
  hwidLinked.forEach((id) => (get(id).sharedHwid = true));
  links.delete(steamId);

  const weight = (l: SmurfLink) =>
    (l.sharedHwid ? 2 : 0) + (l.sharedIp ? 1 : 0);
  return [...links.values()].sort((a, b) => weight(b) - weight(a));
}

@Injectable()
export class SmurfLinksService {
  private readonly logger = new Logger(SmurfLinksService.name);

  constructor(
    private readonly gsApi: ApiClient,
    private readonly user: UserProfileService,
    @InjectRepository(SteamidHwidEntryEntity)
    private readonly hwidRepository: Repository<SteamidHwidEntryEntity>,
  ) {}

  public async getSmurfData(steamId: string): Promise<SmurfData[]> {
    const [ipData, hwidLinked] = await Promise.all([
      this.gsApi.player.playerModerationControllerSmurfData(steamId),
      this.hwidLinkedAccounts(steamId),
    ]);

    const ipBans = new Map(
      ipData.data.relatedBans.map((rb) => [rb.steam_id, rb]),
    );
    const links = mergeSmurfLinks(steamId, [...ipBans.keys()], hwidLinked);
    if (links.length > MAX_LINKS) {
      this.logger.warn(
        `Smurf links for ${steamId} truncated: ${links.length} > ${MAX_LINKS}`,
      );
    }

    return mapWithConcurrency(
      links.slice(0, MAX_LINKS),
      STATS_CONCURRENCY,
      async (link): Promise<SmurfData> => {
        const knownBan = ipBans.get(link.steamId);
        const [user, ban, stats] = await Promise.all([
          this.user.userDto(link.steamId),
          knownBan
            ? Promise.resolve(knownBan)
            : this.gsApi.player
                .playerModerationControllerBanInfo(link.steamId)
                .then((r) => r.data),
          this.matchStats(link.steamId),
        ]);
        return {
          user,
          ban: {
            isBanned: ban.isBanned,
            bannedUntil: ban.bannedUntil,
            status: asBanReason(ban.status),
          },
          sharedHwid: link.sharedHwid,
          sharedIp: link.sharedIp,
          ...stats,
        };
      },
    );
  }

  private async hwidLinkedAccounts(steamId: string): Promise<string[]> {
    const rows: { steam_id: string }[] = await this.hwidRepository
      .createQueryBuilder("e")
      .select("DISTINCT e.steam_id", "steam_id")
      .where(
        `e.hwid IN (SELECT o.hwid FROM steamid_hwid_entry o WHERE o.steam_id = :steamId AND o.hwid <> :unknown)`,
        { steamId, unknown: UNKNOWN_HWID },
      )
      .getRawMany();
    return rows.map((r) => r.steam_id);
  }

  // Stats are a nice-to-have: a gameserver hiccup must not break the whole list
  private async matchStats(
    steamId: string,
  ): Promise<{ games?: number; lastMatch?: string }> {
    try {
      const [summary, matches] = await Promise.all([
        this.gsApi.player.playerProfileControllerPlayerSummary(steamId),
        this.gsApi.match.matchControllerPlayerMatches(steamId, {
          page: 0,
          per_page: 1,
        }),
      ]);
      return {
        games: summary.data.overall?.games,
        lastMatch: matches.data.data[0]?.timestamp,
      };
    } catch (e) {
      this.logger.warn(`Failed to load match stats for ${steamId}`, e);
      return {};
    }
  }
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const result: R[] = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      result[i] = await fn(items[i]);
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker),
  );
  return result;
}
