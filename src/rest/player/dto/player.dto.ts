import { UserConnection } from '../../../gateway/shared-types/user-connection';

export class LeaderboardEntryDto {
  steam_id: string;
  name: string;
  id: string;
  mmr: number;
  rank: number;
}

export class PlayerSummaryDto {
  steam_id: string;
  name: string;
  id: string;
  mmr: number;
  rank: number;
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
