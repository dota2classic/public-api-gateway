import { decideHwidLogin } from "./launcher-hwid-login.decision";
import { BanReason } from "../../gateway/shared-types/ban";

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.parse("2026-10-11T12:00:00Z");
const PERMA = 175200 * 60 * 60 * 1000;

const notBanned = { isBanned: false, bannedUntil: new Date(0).toISOString() };
const bannedFor = (ms: number) => ({
  isBanned: true,
  bannedUntil: new Date(NOW + ms).toISOString(),
});
const ban = (steamId: string, bannedUntil: string) => ({
  steamId,
  bannedUntil,
  reason: BanReason.RULE_VIOLATION,
});

describe("decideHwidLogin", () => {
  const scout = ban("scout", "2026-10-24T07:00:00Z");
  const perma = ban("perma", "2046-10-05T00:00:00Z");

  it("does nothing when no account on the computer is banned", () => {
    expect(decideHwidLogin(notBanned, [], new Set(), true, PERMA, NOW)).toEqual(
      { kind: "none" },
    );
  });

  it("notifies on first login from a computer with a banned account", () => {
    expect(
      decideHwidLogin(notBanned, [scout], new Set(), true, undefined, NOW),
    ).toEqual({ kind: "notify", banned: [scout] });
  });

  it("does not notify again on later logins", () => {
    expect(
      decideHwidLogin(notBanned, [scout], new Set(), false, undefined, NOW),
    ).toEqual({ kind: "none" });
  });

  it("auto-bans when a banned account on the computer has the flag, on any login", () => {
    expect(
      decideHwidLogin(
        notBanned,
        [scout],
        new Set(["scout"]),
        false,
        PERMA,
        NOW,
      ),
    ).toEqual({ kind: "autoban", source: scout });
  });

  it("names the longest-banned flagged account as the source", () => {
    expect(
      decideHwidLogin(
        notBanned,
        [scout, perma],
        new Set(["scout", "perma"]),
        true,
        PERMA,
        NOW,
      ),
    ).toEqual({ kind: "autoban", source: perma });
  });

  it("ignores banned accounts without the flag", () => {
    expect(
      decideHwidLogin(notBanned, [perma], new Set(), true, PERMA, NOW),
    ).toEqual({ kind: "notify", banned: [perma] });
  });

  it("does not punish again an account already serving the punishment", () => {
    // Auto-banned yesterday: perma minus one day left
    expect(
      decideHwidLogin(
        bannedFor(PERMA - DAY),
        [scout],
        new Set(["scout"]),
        false,
        PERMA,
        NOW,
      ),
    ).toEqual({ kind: "none" });
  });

  it("still punishes an account that only has a short ban", () => {
    expect(
      decideHwidLogin(
        bannedFor(DAY),
        [scout],
        new Set(["scout"]),
        false,
        PERMA,
        NOW,
      ),
    ).toEqual({ kind: "autoban", source: scout });
  });

  it("falls back to a notification when the smurf rule is missing", () => {
    expect(
      decideHwidLogin(
        notBanned,
        [scout],
        new Set(["scout"]),
        true,
        undefined,
        NOW,
      ),
    ).toEqual({ kind: "notify", banned: [scout] });
  });
});
