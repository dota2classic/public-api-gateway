import { BracketEntryType } from '../../../gateway/shared-types/tournament';
import { TournamentTournamentDtoStatusEnum } from '../../../generated-api/tournament/models';

export class CreateTournamentDto {
  public readonly name: string;
  public readonly entryType: BracketEntryType;
  public readonly startDate: number;
  public readonly imageUrl: string

}

export class TournamentDto {
  public readonly name: string;
  public readonly entryType: BracketEntryType;
  public readonly id: number;
  public readonly status: TournamentTournamentDtoStatusEnum
  public readonly startDate: number;
  public readonly imageUrl: string;
}
