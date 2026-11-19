import { Injectable } from "@nestjs/common";
import * as memoize from "memoizee";
import { ApiClient } from "@dota2classic/gs-api-generated/dist/module";
import * as GsApi from "@dota2classic/gs-api-generated/dist/Api";

export interface PlayerSummaryBundle {
  summary: GsApi.PlayerSummaryDto;
  ban: GsApi.BanStatusDto;
}

@Injectable()
export class PlayerSummaryService {
  constructor(private readonly gsApi: ApiClient) {}

  public readonly get = memoize(
    async (steamId: string): Promise<PlayerSummaryBundle> => {
      const [summary, ban] = await Promise.all([
        this.gsApi.player.playerProfileControllerPlayerSummary(steamId),
        this.gsApi.player.playerModerationControllerBanInfo(steamId),
      ]);
      return { summary: summary.data, ban: ban.data };
    },
    { promise: true, primitive: true, maxAge: 5000 },
  );

  public getMany = (steamIds: string[]): Promise<PlayerSummaryBundle[]> =>
    Promise.all(steamIds.map((steamId) => this.get(steamId)));

  public invalidate = (steamId: string) => {
    this.get.delete(steamId);
  };
}
