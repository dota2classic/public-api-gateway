import { TeamDto } from './team.dto';
import { BracketEntryType, BracketType } from '../../../gateway/shared-types/tournament';


export enum RoundType {
  CASUAL = 'CASUAL',
  FINAL = 'FINAL'
}
export class SeedItemDto {
  public readonly steam_id?: string;
  public readonly playerName?: string;
  public readonly team?: TeamDto
  public readonly result?: string;
  public readonly tbd?: boolean;
}

export class SeedDto {
  public readonly teams: (SeedItemDto | null)[];
  public readonly date: string;
  public readonly id: number;
  public readonly matchId?: number;
}

export class BracketRoundDto {
  public readonly title: string;
  public readonly round: number;
  public readonly rType: RoundType
  public readonly seeds: SeedDto[];
}


export class BracketDto {
  type: BracketType;
  winning: BracketRoundDto[];
  losing: BracketRoundDto[];
}
