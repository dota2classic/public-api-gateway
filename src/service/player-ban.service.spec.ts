import { BanLevel, PlayerBanService } from "./player-ban.service";

describe("SECRET ban eligibility", () => {
  it.each([
    [0, false],
    [1, false],
    [2, true],
    [4, true],
    [7, true],
    [99, false],
    [undefined, false],
  ])(
    "keeps reason %s separate from active queue blocking",
    async (status, eligible) => {
      const ban = {
        isBanned: true,
        status,
        bannedUntil: new Date(Date.now() + 600000).toISOString(),
      };
      const api = {
        player: {
          playerModerationControllerBanInfo: jest
            .fn()
            .mockResolvedValue({ data: ban }),
        },
      };
      const service = new PlayerBanService(api as any);
      await expect(service.getBanStatus("1")).resolves.toBe(BanLevel.TEMPORAL);
      await expect(service.hasSecretQueueBan("1")).resolves.toBe(eligible);
      ban.isBanned = false;
      await expect(service.hasSecretQueueBan("1")).resolves.toBe(false);
    },
  );
});
