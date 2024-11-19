import { UserDTO } from "../../shared.dto";

export class HeroSummaryDto {
  games: number;
  wins: number;
  losses: number;
  kills: number;
  deaths: number;
  assists: number;
  gpm: number;
  xpm: number;
  last_hits: number;
  denies: number;
  pickrate: number;
  hero: string;
}

export class HeroItemDto {
  item: number;
  game_count: number;
  wins: number;
  winrate: number;
}

export class ItemHeroDto {
  item: number;
  hero: string;
  played: number;
  wins: number;
}

export class ItemDto {
  item: number;
  popularity: number;
  games: number;
  wins: number;
}

export class HeroPlayerDto {
  user: UserDTO;
  games: number;
  wins: number;
  score: number;
  kills: number;
  deaths: number;
  assists: number;
}
