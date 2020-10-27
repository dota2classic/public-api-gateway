import { GameserverMatchDtoModeEnum } from '../../../generated-api/gameserver/models';

export class PlayerInMatchDto {
  steam_id: string;
  name: string;
  team: number;
  hero: string;
  level: number;
  kills: number;
  deaths: number;
  assists: number;
  gpm: number;
  xpm: number;
  last_hits: number;
  denies: number;

  items: Array<string>;

  abandoned: boolean;
}

export class MatchDto {
  id: number;

  mode: GameserverMatchDtoModeEnum;

  radiant: Array<PlayerInMatchDto>;

  dire: Array<PlayerInMatchDto>;

  winner: number;

  duration: number;

  timestamp: string;
}


export class MatchPageDto {
  data: MatchDto[];
  page: number;
  pages: number;
  perPage: number;
}