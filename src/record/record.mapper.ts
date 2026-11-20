import { Injectable } from "@nestjs/common";
import * as GsApi from "@dota2classic/gs-api-generated/dist/Api";
import {
  PlayerDailyRecord,
  PlayerRecordDto,
  PlayerRecordsResponse,
  PlayerYearSummaryDto,
} from "./record.dto";
import { MatchMapper } from "../match/match.mapper";
import { UserProfileService } from "../service/user-profile.service";
import { asMatchmakingMode } from "../types/gs-api-compat";
import { UserDTO } from "../shared.dto";

@Injectable()
export class RecordMapper {
  constructor(
    private readonly urepo: UserProfileService,
    private readonly matchMapper: MatchMapper,
  ) {}

  private mapPlayerRecord = (
    it: GsApi.PlayerRecordDto,
    users: Map<string, UserDTO>,
  ): PlayerRecordDto => ({
    player: users.get(it.steamId),
    match: it.match && this.matchMapper.toMatch(it.match, users),
    recordType: it.recordType,
  });

  public mapDailyRecords = async (
    records: GsApi.PlayerDailyRecord[],
  ): Promise<PlayerDailyRecord[]> => {
    const users = await this.urepo.userDtoMap(records.map((it) => it.steam_id));
    return records.map((it) => ({
      player: users.get(it.steam_id),
      mmrChange: it.mmr_change,
      games: it.games,
      loss: it.loss,
      wins: it.wins,
    }));
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
    const all = [...records.overall, ...records.month, ...records.season, ...records.day];
    const users = await this.urepo.userDtoMap(
      all.flatMap((it) => [it.steamId, ...(it.match ? this.matchMapper.steamIds(it.match) : [])]),
    );
    const map = (list: GsApi.PlayerRecordDto[]) =>
      list.map((it) => this.mapPlayerRecord(it, users));
    return {
      overall: map(records.overall),
      month: map(records.month),
      season: map(records.season),
      day: map(records.day),
    };
  };
}
