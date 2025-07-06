import { MatchmakingMode } from "../../../gateway/shared-types/matchmaking-mode";
import { Dota_GameMode } from "../../../gateway/shared-types/dota-game-mode";
import { ApiProperty } from "@nestjs/swagger";
import { UserDTO } from "../../shared.dto";
import { Dota_GameRulesState } from "../../../gateway/shared-types/dota-game-rules-state";
import { DotaConnectionState } from "../../../gateway/shared-types/dota-player-connection-state";
import { PlayerAspect } from "../../../gateway/shared-types/player-aspect";

export class MmrChangeDto {
  mmr_before: number;
  mmr_after: number;
  change: number;
  is_hidden_mmr: boolean;
  calibration: boolean;
  streak: number;
}

export class PlayerInMatchDto {
  user: UserDTO;

  partyIndex: number;
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

  mmr?: MmrChangeDto;
}

export class MatchDto {
  id: number;

  @ApiProperty({ enum: MatchmakingMode, enumName: "MatchmakingMode" })
  mode: MatchmakingMode;

  @ApiProperty({ enum: Dota_GameMode, enumName: "Dota_GameMode" })
  game_mode: Dota_GameMode;

  radiant: Array<PlayerInMatchDto>;

  dire: Array<PlayerInMatchDto>;

  winner: number;

  duration: number;

  timestamp: string;
  replayUrl?: string;
}

export class MatchReportInfoDto {
  reportableSteamIds: string[];
}

export class MatchPageDto {
  data: MatchDto[];
  page: number;
  pages: number;
  perPage: number;
}

export class PlayerInfo {
  hero: string;
  level: number;

  bot: boolean;

  pos_x: number;
  pos_y: number;
  angle: number;

  mana: number;
  max_mana: number;
  health: number;
  max_health: number;

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

export class MatchSlotInfo {
  user: UserDTO;
  team: number;
  @ApiProperty({ enum: DotaConnectionState, enumName: "DotaConnectionState" })
  connection: DotaConnectionState;

  heroData?: PlayerInfo;
}
export class LiveMatchDto {
  matchId: number;
  @ApiProperty({ enum: MatchmakingMode, enumName: "MatchmakingMode" })
  matchmakingMode: MatchmakingMode;

  @ApiProperty({ enum: Dota_GameMode, enumName: "Dota_GameMode" })
  gameMode: Dota_GameMode;

  @ApiProperty({ enum: Dota_GameRulesState, enumName: "DotaGameRulesState" })
  gameState: Dota_GameRulesState;

  duration: number;
  server: string;
  timestamp: number;
  heroes: MatchSlotInfo[];
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

export class ReportPlayerDto {
  steamId: string;
  @ApiProperty({ enum: PlayerAspect, enumName: "PlayerAspect" })
  aspect: PlayerAspect;

  matchId: number;
}
