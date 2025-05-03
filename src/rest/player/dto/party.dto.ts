import { UserDTO } from "../../shared.dto";
import { BanStatusDto } from "../../admin/dto/admin.dto";
import { PlayerSummaryDto } from "./player.dto";

export class PartyMemberDTO {
  banStatus: BanStatusDto;
  summary: PlayerSummaryDto;
  session?: string;
}
export class PartyDto {
  id: string;
  leader: UserDTO;
  players: PartyMemberDTO[];
  enterQueueAt?: string;
}
