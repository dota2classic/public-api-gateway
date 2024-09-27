import { MatchmakingMode } from '../../../gateway/shared-types/matchmaking-mode';
import { Dota_GameMode } from '../../../gateway/shared-types/dota-game-mode';
import { ApiProperty } from '@nestjs/swagger';

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
  hero_healing: number;
  hero_damage: number;
  tower_damage: number;
  last_hits: number;
  denies: number;
  gold: number;

  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;

  abandoned: boolean;
}


export class MatchDto {
  id: number;

  @ApiProperty({ enum: MatchmakingMode, enumName: 'MatchmakingMode' })
  mode: MatchmakingMode;

  radiant: Array<PlayerInMatchDto>;

  dire: Array<PlayerInMatchDto>;

  winner: number;

  duration: number;
  reportable: boolean;

  timestamp: string;
}

export class MatchPageDto {
  data: MatchDto[];
  page: number;
  pages: number;
  perPage: number;
}

export class PlayerInfo {
  steam_id: string;
  name: string;

  hero: string;
  team: number;
  level: number;

  bot: boolean;

  pos_x: number;
  pos_y: number;
  angle: number

  mana: number
  max_mana: number
  health: number
  max_health: number

  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;

  kills: number;
  deaths: number;
  assists: number;

  respawn_time: number;
}

export class LiveMatchDto {
  matchId: number;
  @ApiProperty({ enum: MatchmakingMode, enumName: 'MatchmakingMode' })
  matchmakingMode: MatchmakingMode;

  @ApiProperty({ enum: Dota_GameMode, enumName: 'Dota_GameMode' })
  gameMode: Dota_GameMode;
  duration: number;
  server: string;
  timestamp: number;
  heroes: PlayerInfo[];
}

export class MessageObjectDto<T> {
  data: string | T;
  id?: string;
  type?: string;
  retry?: number;
}

export class LiveMatchSseDto extends MessageObjectDto<LiveMatchDto> {
  data: LiveMatchDto;
}
