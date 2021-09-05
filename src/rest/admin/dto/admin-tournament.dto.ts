import { BracketEntryType, BracketType } from '../../../gateway/shared-types/tournament';
import { TournamentTournamentDtoStatusEnum } from '../../../generated-api/tournament/models';
import { TeamDto } from '../../tournament/dto/team.dto';
import { PlayerPreviewDto } from '../../player/dto/player.dto';
import { Dota2Version } from '../../../gateway/shared-types/dota2version';

export class CreateTournamentDto {
  public readonly name: string;
  public readonly entryType: BracketEntryType;
  public readonly startDate: number;
  public readonly imageUrl: string;
  public readonly strategy: BracketType;
  public readonly bestOfRound: number;
  public readonly bestOfFinal: number;
  public readonly bestOfGrandFinal: number;
  public readonly version: Dota2Version;
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
  public readonly description: string;
  public readonly version: Dota2Version;
  // here we might want to add field whether we can assign or not
}

export class TournamentParticipantDto {
  profile?: PlayerPreviewDto;
  team?: TeamDto;
}

export class TournamentStandingDto {
  profile?: PlayerPreviewDto;
  team?: TeamDto;
  position: string;
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
  public readonly version: Dota2Version;

  public readonly participants: TournamentParticipantDto[];
  public readonly standings?: TournamentStandingDto[];
  public readonly description: string;
  // here we might want to add field whether we can assign or not
}

export class TournamentMatchGameDto {
  gameId: number;
  bracketMatchId: number;
  matchId?: number;
  scheduledDate: number;
  teamOffset: number;
  number: number;
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
  gameId: number;
  scheduledDate: number;
}

export class ForfeitDto {
  gameId: number;
  forfeitId: string;
}

export class SetWinnerDto {
  gameId: number;
  winnerId: string;
}
