import { BanReason } from "../../gateway/shared-types/ban";

export interface ActiveBan {
  steamId: string;
  bannedUntil: string;
  reason: BanReason;
  // First launcher login of that account from this computer
  firstSeenMs: number;
}

export type HwidLoginDecision =
  | { kind: "none" }
  | { kind: "notify"; banned: ActiveBan[] }
  | { kind: "autoban"; source: ActiveBan };

// Matchmaking penalties (decline, load failure, abandon) are short and
// automatic — they say nothing about the player, so they never count
export const SERIOUS_BAN_REASONS: ReadonlySet<BanReason> = new Set([
  BanReason.INFINITE_BAN,
  BanReason.RULE_VIOLATION,
]);

const until = (b: { bannedUntil: string }) => new Date(b.bannedUntil).getTime();

// Production has reasons missing from the enum (3, 5, 6)
export const reasonName = (r: BanReason) => BanReason[r] ?? `reason ${r}`;

export interface HwidLoginInput {
  ownBan: { isBanned: boolean; bannedUntil: string };
  ownFirstSeenMs: number;
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
 * have a serious active ban:
 * - one of them is flagged for auto-ban and was on this computer first ->
 *   punish the account by the smurfing rule, unless it already serves at least
 *   half of that punishment (repeated logins must not stack punishments).
 *   "Was here first" matters because HWID is sent by the client: a banned
 *   player could send someone else's HWID to get that person auto-banned;
 * - otherwise tell moderators, but only on the first login from this computer
 *   so a regular player does not spam the chat.
 */
export function decideHwidLogin(input: HwidLoginInput): HwidLoginDecision {
  const banned = input.bannedOthers.filter((b) =>
    SERIOUS_BAN_REASONS.has(b.reason),
  );
  if (banned.length === 0) return { kind: "none" };

  const source = banned
    .filter(
      (b) =>
        input.autoBanSources.has(b.steamId) &&
        b.firstSeenMs < input.ownFirstSeenMs,
    )
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
