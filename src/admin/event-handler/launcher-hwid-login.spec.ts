import { decideHwidLogin } from "./launcher-hwid-login.handler";
import { BanReason } from "../../gateway/shared-types/ban";

const notBanned = { isBanned: false, bannedUntil: new Date(0).toISOString() };
const ban = (steamId: string, bannedUntil: string) => ({
  steamId,
  bannedUntil,
  reason: BanReason.RULE_VIOLATION,
});

describe("decideHwidLogin", () => {
  const scout = ban("scout", "2026-10-24T07:00:00Z");
  const perma = ban("perma", "2046-10-05T00:00:00Z");

  it("does nothing when no account on the computer is banned", () => {
    expect(decideHwidLogin(notBanned, [], new Set(), true)).toEqual({
      kind: "none",
    });
  });

  it("notifies on first login from a computer with a banned account", () => {
    expect(decideHwidLogin(notBanned, [scout], new Set(), true)).toEqual({
      kind: "notify",
      banned: [scout],
    });
  });

  it("does not notify again on later logins", () => {
    expect(decideHwidLogin(notBanned, [scout], new Set(), false)).toEqual({
      kind: "none",
    });
  });

  it("auto-bans with the ban of a flagged account, on any login", () => {
    expect(
      decideHwidLogin(notBanned, [scout], new Set(["scout"]), false),
    ).toEqual({ kind: "autoban", source: scout });
  });

  it("takes the longest ban among flagged accounts", () => {
    expect(
      decideHwidLogin(
        notBanned,
        [scout, perma],
        new Set(["scout", "perma"]),
        true,
      ),
    ).toEqual({ kind: "autoban", source: perma });
  });

  it("ignores banned accounts without the flag when choosing the ban", () => {
    expect(
      decideHwidLogin(notBanned, [scout, perma], new Set(["scout"]), true),
    ).toEqual({ kind: "autoban", source: scout });
  });

  it("never shortens a ban the account already has", () => {
    const own = { isBanned: true, bannedUntil: perma.bannedUntil };
    expect(decideHwidLogin(own, [scout], new Set(["scout"]), true)).toEqual({
      kind: "none",
    });
  });

  it("extends a shorter ban the account already has", () => {
    const own = { isBanned: true, bannedUntil: "2026-10-12T00:00:00Z" };
    expect(decideHwidLogin(own, [scout], new Set(["scout"]), true)).toEqual({
      kind: "autoban",
      source: scout,
    });
  });
});
