import { UserConnection } from '../../../gateway/shared-types/user-connection';
import { Role } from '../../../gateway/shared-types/roles';
import { BanStatusDto } from '../../admin/dto/admin.dto';
import { UserDTO } from '../../shared.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Page } from '../../../gateway/shared-types/page';

export class LeaderboardEntryDto {
  user: UserDTO;

  id: string;
  mmr?: number;
  rank?: number;

  games: number;
  wins: number;

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
  @ApiProperty({ enum: Role, enumName: 'Role' })
  roles: Role[];
  rank: number;
  unrankedGamesLeft: number;
  banStatus: BanStatusDto;
  reportsAvailable: number;
}

export class PlayerSummaryDto {
  user: UserDTO;

  id: string;
  mmr?: number;
  rank?: number;
  unrankedGamesLeft: number;
  playedAnyGame: boolean;

  games_played: number;

  wins: number;
  loss: number;

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
  data: LeaderboardEntryDto[]
  page: number;
  perPage: number;
  pages: number;
}
