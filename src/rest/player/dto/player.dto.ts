import { UserConnection } from '../../../gateway/shared-types/user-connection';
import { Role } from '../../../gateway/shared-types/roles';

export class LeaderboardEntryDto {
  steam_id: string;
  name: string;
  id: string;
  mmr: number;
  rank: number;
  roles: Role[];
}

export class PlayerSummaryDto {
  steam_id: string;
  name: string;
  id: string;
  mmr: number;
  roles: Role[];
  rank: number;
  unrankedGamesLeft: number;
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
