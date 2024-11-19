import { MatchmakingMode } from "../../../gateway/shared-types/matchmaking-mode";
import { Dota2Version } from "../../../gateway/shared-types/dota2version";
import { ApiProperty } from "@nestjs/swagger";

export class CurrentOnlineDto {
  inGame: number;
  sessions: number;
  servers: number;
}

export class MatchmakingInfo {
  @ApiProperty({ enum: MatchmakingMode, enumName: "MatchmakingMode" })
  mode: MatchmakingMode;
  enabled: boolean;
  @ApiProperty({ enum: Dota2Version, enumName: "Dota2Version" })
  version: Dota2Version;
}
