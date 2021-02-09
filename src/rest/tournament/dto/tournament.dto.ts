import { TeamDto } from './team.dto';
import { BracketEntryType, BracketType } from '../../../gateway/shared-types/tournament';
import { PlayerPreviewDto } from '../../player/dto/player.dto';


export enum RoundType {
  CASUAL = 'CASUAL',
  FINAL = 'FINAL'
}
export class SeedItemDto {
  public readonly profile?: PlayerPreviewDto
  public readonly team?: TeamDto
  public readonly isTeam: boolean;
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
