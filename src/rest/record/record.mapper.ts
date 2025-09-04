import { Injectable } from "@nestjs/common";
import { PlayerDailyRecord, PlayerRecordDto } from "./record.dto";
import {
  GameserverPlayerDailyRecord,
  GameserverPlayerRecordDto,
} from "../../generated-api/gameserver";
import { MatchMapper } from "../match/match.mapper";
import { UserProfileService } from "../../service/user-profile.service";

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
}
