import { BracketEntryType, BracketType } from '../../../gateway/shared-types/tournament';
import { TournamentTournamentDtoStatusEnum } from '../../../generated-api/tournament/models';
import { TeamDto } from '../../tournament/dto/team.dto';
import { PlayerPreviewDto } from '../../player/dto/player.dto';

export class CreateTournamentDto {
  public readonly name: string;
  public readonly entryType: BracketEntryType;
  public readonly startDate: number;
  public readonly imageUrl: string;
  public readonly strategy: BracketType;

}



export class StartTournamentDto {

  public readonly id: number;

}


export class TournamentDto {
  public readonly name: string;
  public readonly entryType: BracketEntryType;
  public readonly id: number;
  public readonly status: TournamentTournamentDtoStatusEnum
  public readonly startDate: number;
  public readonly imageUrl: string;
  // here we might want to add field whether we can assign or not
}


export class TournamentParticipantDto {
  profile?: PlayerPreviewDto
  team?: TeamDto
}

export class FullTournamentDto {
  public readonly name: string;
  public readonly entryType: BracketEntryType;
  public readonly id: number;
  public readonly status: TournamentTournamentDtoStatusEnum
  public readonly startDate: number;
  public readonly imageUrl: string;
  public readonly isLocked: boolean;
  public readonly isParticipating: boolean
  public readonly participants: TournamentParticipantDto[];
  // here we might want to add field whether we can assign or not
}
