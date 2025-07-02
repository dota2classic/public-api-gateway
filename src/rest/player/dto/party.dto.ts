import { UserDTO } from "../../shared.dto";
import { PlayerSummaryDto } from "./player.dto";
import { MatchmakingMode } from "../../../gateway/shared-types/matchmaking-mode";
import { ApiProperty } from "@nestjs/swagger";

export class SessionDto {
  serverUrl: string;
  matchId: number;

  @ApiProperty({ enum: MatchmakingMode, enumName: "MatchmakingMode" })
  lobbyType: MatchmakingMode;
}
export class PartyMemberDTO {
  summary: PlayerSummaryDto;
  session?: SessionDto;
  lobbyId?: string;
}
export class PartyDto {
  id: string;
  leader: UserDTO;
  players: PartyMemberDTO[];
  enterQueueAt?: string;
}
