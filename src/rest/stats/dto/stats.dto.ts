import { MatchmakingMode } from "../../../gateway/shared-types/matchmaking-mode";
import { ApiProperty } from "@nestjs/swagger";
import { Dota_GameMode } from "../../../gateway/shared-types/dota-game-mode";
import { Dota_Map } from "../../../gateway/shared-types/dota-map";

export class CurrentOnlineDto {
  inGame: number;
  sessions: number;
  servers: number;

  perMode: PerModePlayersDto[];
}

export class MatchmakingInfo {
  @ApiProperty({ enum: MatchmakingMode, enumName: "MatchmakingMode" })
  lobby_type: MatchmakingMode;

  @ApiProperty({ enum: Dota_GameMode, enumName: "Dota_GameMode" })
  game_mode: Dota_GameMode;

  @ApiProperty({ enum: Dota_Map, enumName: "Dota_Map" })
  dota_map: Dota_Map;

  enabled: boolean;
}

export class PerModePlayersDto {
  @ApiProperty({ enum: MatchmakingMode, enumName: "MatchmakingMode" })
  lobby_type: MatchmakingMode;

  playerCount: number;
}


export class GameSeasonDto {
  id: number;
  startTimestamp: string;
  isActive: boolean;
}

