import { GameserverMatchDtoModeEnum } from '../../../generated-api/gameserver/models';
import { MatchmakingMode } from '../../../gateway/shared-types/matchmaking-mode';

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


export class PlayerInfo {
  hero: string;
  team: number;
  steam_id: string;
  level: number;
  pos_x: number;
  bot: boolean;
  pos_y: number;
  items: string[];
  kills: number;
  deaths: number;
  assists: number;
}

export class LiveMatchDto {
  matchId: number;
  type: MatchmakingMode;
  duration: number;
  server: string;
  timestamp: number;
  heroes: PlayerInfo[];
}
