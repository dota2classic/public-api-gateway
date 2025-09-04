import { ApiProperty } from "@nestjs/swagger";
import { MatchDto } from "../match/dto/match.dto";
import { GameserverRecordType } from "../../generated-api/gameserver";
import { UserDTO } from "../shared.dto";

export class PlayerRecordDto {
  @ApiProperty({ enum: GameserverRecordType, enumName: "RecordType" })
  recordType: GameserverRecordType;

  player: UserDTO;

  match?: MatchDto;
}

export class PlayerRecordsResponse {
  season: PlayerRecordDto[];
  overall: PlayerRecordDto[];
  month: PlayerRecordDto[];
  day: PlayerRecordDto[];
}



export class PlayerDailyRecord {
  player: UserDTO;
  mmrChange: number;
  games: number;
  wins: number;
  loss: number;
}
