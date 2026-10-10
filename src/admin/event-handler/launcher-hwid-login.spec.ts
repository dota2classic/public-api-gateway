import {
  ActiveBan,
  decideHwidLogin,
  HwidLoginInput,
} from "./launcher-hwid-login.decision";
import { BanReason } from "../../gateway/shared-types/ban";

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.parse("2026-10-11T12:00:00Z");
const PERMA = 175200 * 60 * 60 * 1000;

const notBanned = { isBanned: false, bannedUntil: new Date(0).toISOString() };
const bannedFor = (ms: number) => ({
  isBanned: true,
  bannedUntil: new Date(NOW + ms).toISOString(),
});
const ban = (
  steamId: string,
  bannedUntil: string,
  reason = BanReason.RULE_VIOLATION,
): ActiveBan => ({ steamId, bannedUntil, reason });

const input = (over: Partial<HwidLoginInput>): HwidLoginInput => ({
  ownBan: notBanned,
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

  it("auto-bans when a banned account on the computer has the flag, on any login", () => {
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

  it("any active ban of the flagged account counts, even a short one", () => {
    const abandon = ban("scout", "2026-10-11T12:10:00Z", BanReason.ABANDON);
    expect(
      decideHwidLogin(
        input({
          bannedOthers: [abandon],
          autoBanSources: new Set(["scout"]),
        }),
      ),
    ).toEqual({ kind: "autoban", source: abandon });
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
