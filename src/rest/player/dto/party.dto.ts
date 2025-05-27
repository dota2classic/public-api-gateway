import { UserDTO } from "../../shared.dto";
import { PlayerSummaryDto } from "./player.dto";

export class PartyMemberDTO {
  summary: PlayerSummaryDto;
  session?: string;
}
export class PartyDto {
  id: string;
  leader: UserDTO;
  players: PartyMemberDTO[];
  enterQueueAt?: string;
}
