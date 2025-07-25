import { UserConnection } from "../../../gateway/shared-types/user-connection";
import { BanStatusDto } from "../../admin/dto/admin.dto";
import { UserDTO } from "../../shared.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Page } from "../../../gateway/shared-types/page";
import { PlayerAspect } from "../../../gateway/shared-types/player-aspect";
import { MatchmakingMode } from "../../../gateway/shared-types/matchmaking-mode";

export class LeaderboardEntryDto {
  user: UserDTO;

  id: string;
  mmr?: number;
  rank?: number;

  games: number;
  wins: number;
  abandons: number;

  kills: number;
  deaths: number;
  assists: number;

  play_time: number;
}

export class PlayerTeammateDto {
  readonly user: UserDTO;

  public readonly games: number;
  public readonly wins: number;
  public readonly losses: number;
  public readonly winrate: number;
  public readonly rank: number;
}

export class MeDto {
  user: UserDTO;

  id: string;
  mmr: number;
  rank: number;
  banStatus: BanStatusDto;
  reportsAvailable: number;
}

export class GamemodeAccessMap {
  education: boolean;
  simpleModes: boolean;
  humanGames: boolean;
}

export class PlayerAspectDto {
  @ApiProperty({ enum: PlayerAspect, enumName: "PlayerAspect" })
  aspect: PlayerAspect;

  count: number;
}

export class PlayerStatsDto {
  games_played: number;

  wins: number;
  loss: number;
  abandons: number;

  kills: number;
  deaths: number;
  assists: number;

  playtime: number;
  recalibrationAttempted: boolean;

  mmr?: number;
  rank?: number;
}

export class RecalibrationDto {
  id: number;
  createdAt: string;
  seasonId: number;
}

export class PlayerSessionDto {
  matchId: number;
  serverUrl: string;
  @ApiProperty({ enum: MatchmakingMode, enumName: "MatchmakingMode" })
  lobbyType: MatchmakingMode;
}

export class PlayerSummaryDto {
  user: UserDTO;
  banStatus: BanStatusDto;

  id: string;
  calibrationGamesLeft: number;

  recalibration?: RecalibrationDto;

  seasonStats: PlayerStatsDto;
  overallStats: PlayerStatsDto;
  session?: PlayerSessionDto;

  accessMap: GamemodeAccessMap;
  aspects: PlayerAspectDto[];

  // asdfsa
}

export class ConnectionDto {
  connection: UserConnection;
  avatar: string;
  id: string;
  name: string;
}
export class MyProfileDto {
  discord?: ConnectionDto;
  error?: boolean;
}

export class PlayerPreviewDto {
  name: string;
  id: string;
  avatar: string;
}

export class PlayerTeammatePageDto {
  data: PlayerTeammateDto[];
  page: number;
  pages: number;
  perPage: number;
}

export class LeaderboardEntryPageDto extends Page<LeaderboardEntryDto> {
  data: LeaderboardEntryDto[];
  page: number;
  perPage: number;
  pages: number;
}

export class DodgeListEntryDto {
  user: UserDTO;
  createdAt: string;
}

export class DodgePlayerDto {
  dodgeSteamId: string;
}
