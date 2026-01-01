import { ApiProperty } from "@nestjs/swagger";
import { MatchDto } from "../match/dto/match.dto";
import { GameserverRecordType } from "../../generated-api/gameserver";
import { UserDTO } from "../shared.dto";
import { MatchmakingMode } from "../../gateway/shared-types/matchmaking-mode";

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

export class PlayerYearSummaryDto {
  steamId: string;

  lastHits: number;
  denies: number;
  gold: number;
  supportGold: number;

  kills: number;
  deaths: number;
  assists: number;
  misses: number;

  kda: number;
  playedGames: number;

  @ApiProperty({ enum: MatchmakingMode, enumName: "MatchmakingMode" })
  mostPlayedMode: MatchmakingMode;
  mostPlayedModeCount: number;

  mostPurchasedItem: number;
  mostPurchasedItemCount: number;
}
