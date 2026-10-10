import {
  ActiveBan,
  decideHwidLogin,
  HwidLoginInput,
} from "./launcher-hwid-login.decision";
import { BanReason } from "../../gateway/shared-types/ban";

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.parse("2026-10-11T12:00:00Z");
const PERMA = 175200 * 60 * 60 * 1000;
// The twin first appeared on the computer a day ago
const TWIN_FIRST_SEEN = NOW - DAY;

const notBanned = { isBanned: false, bannedUntil: new Date(0).toISOString() };
const bannedFor = (ms: number) => ({
  isBanned: true,
  bannedUntil: new Date(NOW + ms).toISOString(),
});
const ban = (
  steamId: string,
  bannedUntil: string,
  reason = BanReason.RULE_VIOLATION,
  firstSeenMs = NOW - 100 * DAY,
): ActiveBan => ({ steamId, bannedUntil, reason, firstSeenMs });

const input = (over: Partial<HwidLoginInput>): HwidLoginInput => ({
  ownBan: notBanned,
  ownFirstSeenMs: TWIN_FIRST_SEEN,
  bannedOthers: [],
  autoBanSources: new Set(),
  isNewEntry: true,
  punishmentMs: PERMA,
  nowMs: NOW,
  ...over,
});

describe("decideHwidLogin", () => {
  const scout = ban("scout", "2026-10-24T07:00:00Z");
  const perma = ban("perma", "2046-10-05T00:00:00Z");

  it("does nothing when no account on the computer is banned", () => {
    expect(decideHwidLogin(input({}))).toEqual({ kind: "none" });
  });

  it("notifies on first login from a computer with a banned account", () => {
    expect(decideHwidLogin(input({ bannedOthers: [scout] }))).toEqual({
      kind: "notify",
      banned: [scout],
    });
  });

  it("does not notify again on later logins", () => {
    expect(
      decideHwidLogin(input({ bannedOthers: [scout], isNewEntry: false })),
    ).toEqual({ kind: "none" });
  });

  it("auto-bans when a flagged banned account was on the computer first, on any login", () => {
    expect(
      decideHwidLogin(
        input({
          bannedOthers: [scout],
          autoBanSources: new Set(["scout"]),
          isNewEntry: false,
        }),
      ),
    ).toEqual({ kind: "autoban", source: scout });
  });

  it("names the longest-banned flagged account as the source", () => {
    expect(
      decideHwidLogin(
        input({
          bannedOthers: [scout, perma],
          autoBanSources: new Set(["scout", "perma"]),
        }),
      ),
    ).toEqual({ kind: "autoban", source: perma });
  });

  it("ignores banned accounts without the flag", () => {
    expect(decideHwidLogin(input({ bannedOthers: [perma] }))).toEqual({
      kind: "notify",
      banned: [perma],
    });
  });

  it("ignores short matchmaking penalties entirely", () => {
    const abandon = ban("scout", "2026-10-11T12:10:00Z", BanReason.ABANDON);
    expect(
      decideHwidLogin(
        input({
          bannedOthers: [abandon],
          autoBanSources: new Set(["scout"]),
        }),
      ),
    ).toEqual({ kind: "none" });
  });

  it("does not auto-ban when the flagged account came to this computer later (spoofed HWID)", () => {
    const griefer = ban(
      "griefer",
      "2046-10-05T00:00:00Z",
      BanReason.RULE_VIOLATION,
      NOW - 1000,
    );
    expect(
      decideHwidLogin(
        input({
          bannedOthers: [griefer],
          autoBanSources: new Set(["griefer"]),
          isNewEntry: false,
        }),
      ),
    ).toEqual({ kind: "none" });
  });

  it("does not punish again an account already serving the punishment", () => {
    // Auto-banned yesterday: perma minus one day left
    expect(
      decideHwidLogin(
        input({
          ownBan: bannedFor(PERMA - DAY),
          bannedOthers: [scout],
          autoBanSources: new Set(["scout"]),
          isNewEntry: false,
        }),
      ),
    ).toEqual({ kind: "none" });
  });

  it("still punishes an account that only has a short ban", () => {
    expect(
      decideHwidLogin(
        input({
          ownBan: bannedFor(DAY),
          bannedOthers: [scout],
          autoBanSources: new Set(["scout"]),
        }),
      ),
    ).toEqual({ kind: "autoban", source: scout });
  });

  it("falls back to a notification when the smurf rule is missing", () => {
    expect(
      decideHwidLogin(
        input({
          bannedOthers: [scout],
          autoBanSources: new Set(["scout"]),
          punishmentMs: undefined,
        }),
      ),
    ).toEqual({ kind: "notify", banned: [scout] });
  });
});
