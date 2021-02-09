import { BracketEntryType, BracketType } from '../../../gateway/shared-types/tournament';
import {
  TournamentSeedItemDto,
  TournamentTournamentDtoStatusEnum,
  TournamentTournamentMatchDtoStatusEnum,
} from '../../../generated-api/tournament/models';
import { TeamDto } from '../../tournament/dto/team.dto';
import { PlayerPreviewDto } from '../../player/dto/player.dto';
import { SeedItemDto } from '../../tournament/dto/tournament.dto';

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
  public readonly status: TournamentTournamentDtoStatusEnum;
  public readonly startDate: number;
  public readonly imageUrl: string;
  // here we might want to add field whether we can assign or not
}

export class TournamentParticipantDto {
  profile?: PlayerPreviewDto;
  team?: TeamDto;
}

export class FullTournamentDto {
  public readonly name: string;
  public readonly entryType: BracketEntryType;
  public readonly id: number;
  public readonly status: TournamentTournamentDtoStatusEnum;
  public readonly startDate: number;
  public readonly imageUrl: string;
  public readonly isLocked: boolean;
  public readonly isParticipating: boolean;
  public readonly participants: TournamentParticipantDto[];
  // here we might want to add field whether we can assign or not
}

export class TournamentMatchDto {
  id: number;
  status: MatchStatus;
  scheduledDate: number;
  externalMatchId: number;
  teamOffset: number;
  opponent1?: SeedItemDto;
  opponent2?: SeedItemDto;
}


export enum MatchStatus {
  /** The two matches leading to this one are not completed yet. */
  Locked = 'Locked',
  /** One participant is ready and waiting for the other one. */
  Waiting = 'Waiting',
  /** Both participants are ready to start. */
  Ready = 'Ready',
  /** The match is running. */
  Running = 'Running',
  /** The match is completed. */
  Completed = 'Completed',
  /** At least one participant completed his following match. */
  Archived = 'Archived',
}



export class ScheduleTournamentMatchDto {
  scheduledDate: number
}

export class ForfeitDto {
  forfeitId: string;
}

export class SetWinnerDto {
  winnerId: string;
}
