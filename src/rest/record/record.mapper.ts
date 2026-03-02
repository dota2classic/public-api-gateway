import { Injectable } from "@nestjs/common";
import * as GsApi from "@dota2classic/gs-api-generated/dist/Api";
import {
  PlayerDailyRecord,
  PlayerRecordDto,
  PlayerRecordsResponse,
  PlayerYearSummaryDto,
} from "./record.dto";
import { MatchMapper } from "../match/match.mapper";
import { UserProfileService } from "../../service/user-profile.service";
import { asMatchmakingMode } from "../../types/gs-api-compat";

@Injectable()
export class RecordMapper {
  constructor(
    private readonly urepo: UserProfileService,
    private readonly matchMapper: MatchMapper,
  ) {}

  public mapPlayerRecord = async (
    it: GsApi.PlayerRecordDto,
  ): Promise<PlayerRecordDto> => {
    return {
      player: await this.urepo.userDto(it.steamId),
      match: it.match && (await this.matchMapper.mapMatch(it.match)),
      recordType: it.recordType,
    };
  };

  public mapDailyRecord = async (
    it: GsApi.PlayerDailyRecord,
  ): Promise<PlayerDailyRecord> => {
    return {
      player: await this.urepo.userDto(it.steam_id),
      mmrChange: it.mmr_change,
      games: it.games,
      loss: it.loss,
      wins: it.wins,
    };
  };

  mapYearResult = (source: GsApi.PlayerYearSummaryDto): PlayerYearSummaryDto => ({
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

    mostPlayedMode: asMatchmakingMode(source.most_played_mode),
    mostPlayedModeCount: source.most_played_mode_count,

    mostPurchasedItem: source.most_purchased_item,
    mostPurchasedItemCount: source.most_purchased_item_count,
  });

  public mapRecordsResponse = async (
    records: GsApi.PlayerRecordsResponse,
  ): Promise<PlayerRecordsResponse> => {
    const [overall, month, season, day] = await Promise.all([
      Promise.all(records.overall.map(this.mapPlayerRecord)),
      Promise.all(records.month.map(this.mapPlayerRecord)),
      Promise.all(records.season.map(this.mapPlayerRecord)),
      Promise.all(records.day.map(this.mapPlayerRecord)),
    ]);
    return { overall, month, season, day };
  };
}
