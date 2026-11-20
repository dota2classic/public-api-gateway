import { UserProfileService } from "./user-profile.service";

const profile = (steamId: string) => ({
  steamId,
  name: `name ${steamId}`,
  avatar: `https://cdn/${steamId}_full.jpg`,
  roles: [{ role: "OLD", endTime: "2999-01-01T00:00:00.000Z" }],
  connections: [{ connection: "TWITCH", externalId: steamId }],
});

const makeService = () => {
  const store = new Map(["1", "2"].map((id) => [`user-profile-fast:${id}`, JSON.stringify(profile(id))]));
  const fast = {
    cacheKey: "user-profile-fast",
    get: async (id: string) => JSON.parse(store.get(`user-profile-fast:${id}`) ?? "null") ?? undefined,
  };
  const redis = { mget: async (keys: string[]) => keys.map((key) => store.get(key) ?? null) };
  const decorations = { get: async () => undefined };
  const flags = { find: async () => [{ steamId: "2" }, { steamId: "3" }] };
  return new UserProfileService(redis as never, fast as never, decorations as never, {} as never, flags as never);
};

describe("UserProfileService", () => {
  const service = makeService();
  const ids = ["1", "2", "3", "4"];

  it("maps a batch exactly like single lookups", async () => {
    const single = await Promise.all(ids.map(service.userDto));
    expect(await service.userDtos(ids)).toEqual(single);
  });

  it("shows legally removed players as Removed, with or without a cached profile", async () => {
    const byId = await service.userDtoMap(ids);
    for (const id of ["2", "3"]) {
      expect(byId.get(id)).toMatchObject({ name: "Removed", avatar: "", avatarSmall: "", connections: [] });
    }
    expect(byId.get("1")).toMatchObject({ name: "name 1", avatarSmall: "https://cdn/1_medium.jpg" });
    expect(byId.get("4")).toMatchObject({ name: "Loading", avatar: "" });
  });
});
