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

export class PlayerPreviewDto {
  name: string;
  id: string;
  avatar: string;
}
