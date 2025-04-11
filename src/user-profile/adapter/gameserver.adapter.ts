import { Injectable } from "@nestjs/common";
import { PlayerApi } from "../../generated-api/gameserver";
import { _UserProfileDataJson } from "../dto/user-profile.dto";

@Injectable()
export class GameServerAdapter {
  constructor(private readonly playerApi: PlayerApi) {}

  public async resolveSummary(
    steamId: string,
  ): Promise<{ player: _UserProfileDataJson["player"] }> {
    const [summary, ban] = await Promise.combine([
      this.playerApi.playerControllerPlayerSummary(steamId),
      this.playerApi.playerControllerBanInfo(steamId),
    ]);

    return {
      player: {
        mmr: summary.mmr,
        rank: summary.rank,
        calibrationGamesLeft: summary.calibrationGamesLeft,
        accessLevel: summary.accessLevel,

        win: summary.wins,
        loss: summary.games - summary.wins,
        abandon: 0,
        games: summary.games,
        playtime: summary.playtime,

        kills: summary.kills,
        deaths: summary.deaths,
        assists: summary.assists,

        aspects: summary.reports,
        ban: {
          isBanned: ban.isBanned,
          bannedUntil: ban.bannedUntil,
          status: ban.status,
        },
      },
    };
  }
}
