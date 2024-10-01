import { UserDTO } from '../../shared.dto';

export class PartyDto {
  id: string;
  leader: UserDTO;
  players: UserDTO[];
}
