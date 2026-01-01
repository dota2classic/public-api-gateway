import { Injectable } from "@nestjs/common";
import {
  PlayerDailyRecord,
  PlayerRecordDto,
  PlayerYearSummaryDto,
} from "./record.dto";
import {
  GameserverPlayerDailyRecord,
  GameserverPlayerRecordDto,
  GameserverPlayerYearSummaryDto,
} from "../../generated-api/gameserver";
import { MatchMapper } from "../match/match.mapper";
import { UserProfileService } from "../../service/user-profile.service";
import { MatchmakingMode } from "../../gateway/shared-types/matchmaking-mode";

@Injectable()
export class RecordMapper {
  constructor(
    private readonly urepo: UserProfileService,
    private readonly matchMapper: MatchMapper,
  ) {}

  public mapPlayerRecord = async (
    it: GameserverPlayerRecordDto,
  ): Promise<PlayerRecordDto> => {
    return {
      player: await this.urepo.userDto(it.steamId),
      match: it.match && (await this.matchMapper.mapMatch(it.match)),
      recordType: it.recordType,
    };
  };

  public mapDailyRecord = async (
    it: GameserverPlayerDailyRecord,
  ): Promise<PlayerDailyRecord> => {
    return {
      player: await this.urepo.userDto(it.steam_id),
      mmrChange: it.mmr_change,
      games: it.games,
      loss: it.loss,
      wins: it.wins,
    };
  };

  mapYearResult = (
    source: GameserverPlayerYearSummaryDto,
  ): PlayerYearSummaryDto => ({
    steamId: source.steam_id,

    lastHits: source.last_hits,
    denies: source.denies,
    gold: source.gold,
    supportGold: source.support_gold,

    kills: source.kills,
    deaths: source.deaths,
    assists: source.assists,
    misses: source.misses,

    kda: source.kda,
    playedGames: source.played_games,

    mostPlayedMode: source.most_played_mode as MatchmakingMode,
    mostPlayedModeCount: source.most_played_mode_count,

    mostPurchasedItem: source.most_purchased_item,
    mostPurchasedItemCount: source.most_purchased_item_count,
  });
}
