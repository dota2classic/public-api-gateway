import { UserDTO } from "../../shared.dto";
import { BanStatusDto } from "../../admin/dto/admin.dto";

export class PartyMemberDTO {
  user: UserDTO;
  banStatus: BanStatusDto;
}
export class PartyDto {
  id: string;
  leader: UserDTO;
  players: PartyMemberDTO[];
}
