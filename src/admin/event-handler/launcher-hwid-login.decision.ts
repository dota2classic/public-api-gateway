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

export interface HwidLoginInput {
  ownBan: { isBanned: boolean; bannedUntil: string };
  // Other accounts on this computer with an active ban
  bannedOthers: ActiveBan[];
  // Accounts flagged "auto-ban twins by HWID"
  autoBanSources: Set<string>;
  // First login of this account from this computer
  isNewEntry: boolean;
  // The smurfing rule's punishment; undefined if the rule is missing
  punishmentMs: number | undefined;
  nowMs: number;
}

/**
 * What to do when an account logs in from a computer where other accounts
 * have an active ban:
 * - one of them is flagged for auto-ban -> punish the account by the smurfing
 *   rule, unless it already serves at least half of that punishment
 *   (repeated logins must not stack punishments);
 * - otherwise tell moderators, but only on the first login from this computer
 *   so the moderators' chat is not spammed on every launcher start.
 */
export function decideHwidLogin(input: HwidLoginInput): HwidLoginDecision {
  const banned = input.bannedOthers;
  if (banned.length === 0) return { kind: "none" };

  const source = banned
    .filter((b) => input.autoBanSources.has(b.steamId))
    .sort((a, b) => until(b) - until(a))[0];

  if (source && input.punishmentMs !== undefined) {
    const alreadyPunished =
      input.ownBan.isBanned &&
      until(input.ownBan) >= input.nowMs + input.punishmentMs / 2;
    if (alreadyPunished) return { kind: "none" };
    return { kind: "autoban", source };
  }

  if (input.ownBan.isBanned || !input.isNewEntry) return { kind: "none" };
  return { kind: "notify", banned };
}
