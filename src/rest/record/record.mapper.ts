import { Injectable } from "@nestjs/common";
import { PlayerRecordDto } from "./record.dto";
import { GameserverPlayerRecordDto } from "../../generated-api/gameserver";
import { UserRepository } from "../../cache/user/user.repository";
import { MatchMapper } from "../match/match.mapper";

@Injectable()
export class RecordMapper {
  constructor(
    private readonly urepo: UserRepository,
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
}
