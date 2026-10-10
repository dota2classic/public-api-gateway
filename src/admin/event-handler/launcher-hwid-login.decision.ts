import { BanReason } from "../../gateway/shared-types/ban";

export interface ActiveBan {
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
export const reasonName = (r: BanReason) => BanReason[r] ?? `reason ${r}`;

/**
 * What to do when an account logs in from a computer where other accounts
 * have active bans:
 * - one of them has the auto-ban flag -> punish the account by the smurfing
 *   rule, unless it already serves a ban that long (so repeated logins of an
 *   already punished twin do not stack punishments);
 * - otherwise tell moderators, but only on the first login from this computer
 *   so a regular player does not spam the chat.
 * `punishmentMs` is the smurfing rule's punishment; undefined if the rule is
 * missing, then auto-ban is impossible and moderators are notified instead.
 */
export function decideHwidLogin(
  ownBan: { isBanned: boolean; bannedUntil: string },
  bannedOthers: ActiveBan[],
  autoBanSources: Set<string>,
  isNewEntry: boolean,
  punishmentMs: number | undefined,
  nowMs: number,
): HwidLoginDecision {
  if (bannedOthers.length === 0) return { kind: "none" };

  const source = bannedOthers
    .filter((b) => autoBanSources.has(b.steamId))
    .sort((a, b) => until(b) - until(a))[0];

  if (source && punishmentMs !== undefined) {
    // Half the punishment as a margin: a ban given by this very rule earlier
    // has already been running for a while
    const alreadyPunished =
      ownBan.isBanned && until(ownBan) >= nowMs + punishmentMs / 2;
    if (alreadyPunished) return { kind: "none" };
    return { kind: "autoban", source };
  }

  if (ownBan.isBanned || !isNewEntry) return { kind: "none" };
  return { kind: "notify", banned: bannedOthers };
}
