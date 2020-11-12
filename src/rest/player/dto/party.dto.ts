export class PlayerInPartyDto {
  steam_id: string;
  avatar: string;
  name: string;
}

export class PartyDto {
  id: string;
  leader: PlayerInPartyDto;
  players: PlayerInPartyDto[];
}
