import { mergeSmurfLinks } from "./smurf-links.service";

describe("mergeSmurfLinks", () => {
  it("excludes the player himself", () => {
    const links = mergeSmurfLinks("1", ["1", "2"], ["1"]);
    expect(links.map((l) => l.steamId)).toEqual(["2"]);
  });

  it("marks accounts found both by IP and by HWID", () => {
    const [link] = mergeSmurfLinks("1", ["2"], ["2"]);
    expect(link).toEqual({ steamId: "2", sharedHwid: true, sharedIp: true });
  });

  it("orders HWID+IP first, then HWID only, then IP only", () => {
    const links = mergeSmurfLinks("1", ["ip", "both"], ["hwid", "both"]);
    expect(links.map((l) => l.steamId)).toEqual(["both", "hwid", "ip"]);
  });

  it("returns empty list when nothing is linked", () => {
    expect(mergeSmurfLinks("1", ["1"], [])).toEqual([]);
  });
});
