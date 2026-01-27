import {
  MatchStatus,
  TournamentStatus,
} from "../../gateway/shared-types/tournament";
import { TournamentBracketType } from "../../generated-api/tournament";
import { UserDTO } from "../shared.dto";

export enum TournamentRegistrationState {
  CREATED = "CREATED",
  PENDING_CONFIRMATION = "PENDING_CONFIRMATION",
  CONFIRMED = "CONFIRMED",
  DECLINED = "DECLINED",
  TIMED_OUT = "TIMED_OUT",
}

export class RegisterAsPartyDto {
  steamIds: string[];
}

export class ConfirmRegistrationDto {
  steamId: string;
  confirm: boolean;
}

// export class CreateTournamentDto {
//   name: string;
//   teamSize: number;
//   description: string;
//   startDate: Date;
//   imageUrl: string;
//   strategy: TournamentBracketType;
//   roundBestOf: number;
//   finalBestOf: number;
//   grandFinalBestOf: number;
// }
//

export class CreateTournamentDto {
  name: string;
  teamSize: number;
  description: string;
  startDate: Date;
  imageUrl: string;

  strategy: TournamentBracketType;
  roundBestOf: number;
  finalBestOf: number;
  grandFinalBestOf: number;
}

export class UpdateTournamentDto {
  name?: string;
  description?: string;

  teamSize?: number;
  startDate?: Date;
  imageUrl?: string;

  strategy?: TournamentBracketType;
  roundBestOf?: number;
  finalBestOf?: number;
  grandFinalBestOf?: number;
}

export class UpdateTournamentStatusDto {
  status: TournamentStatus;
}

export class TournamentParticipantDto {
  public readonly players: string[];
  // public readonly team?: TeamDto;
}

export class RegistrationPlayerDto {
  user: UserDTO;
  state: TournamentRegistrationState;
}
export class RegistrationDto {
  id: number;
  players: RegistrationPlayerDto[];
  state: TournamentRegistrationState;
}

export class TournamentDto {
  id: number;
  name: string;
  status: TournamentStatus;
  startDate: Date;
  imageUrl: string;
  description: string;
  registrations: RegistrationDto[];
}

export class TournamentStandingDto {
  steam_id?: string;
  // team?: TeamDto;
  position: string;
}

export class FullTournamentDto {
  id: number;
  name: string;
  status: TournamentStatus;
  startDate: number;
  imageUrl: string;
  participants: TournamentParticipantDto[];
  standings?: TournamentStandingDto[];
  description: string;
}

export class BracketOpponentDto {
  id: number;
  // tournament_id: number;
  result?: "win" | "loss" | "draw";
  // team?: TeamDto;
  tbd?: boolean;
  score?: number;
  position?: number;

  players?: UserDTO[];

  participant?: SmallParticipantDto;
}

export class SmallParticipantDto {
  id: number;
  tournament_id: number;
  players?: UserDTO[];
}

export class ScheduleTournamentMatchDto {
  gameId: number;
  scheduledDate: number;
}

export class ForfeitDto {
  gameId: number;
  forfeitId: string;
}

export class SetMatchResultDto {
  gameId: number;
  winnerId: string;
}

/**
 * New bracket stuff
 */

export class StageDto {
  /** ID of the stage. */
  id: number;
  /** ID of the tournament this stage belongs to. */
  tournament_id: number;
  /** Name of the stage. */
  name: string;
  /** Type of the stage. */
  type: string;
  /** Settings of the stage. */
  settings: object;
  /** The number of the stage in its tournament. */
  number: number;
}

export class GroupDto {
  id: number;
  stage_id: number;
  number: number;
}

export class RoundDto {
  id: number;
  number: number;
  stage_id: number;
  group_id: number;
}

export class MatchOpponent {
  id: number | null;
  position?: number;
  score?: number;
  result?: "win" | "loss" | "draw";
}

export class Match {
  id: number;
  number: number;
  stage_id: number;
  group_id: number;
  round_id: number;
  child_count: number;
  status: MatchStatus;
  opponent1?: MatchOpponent;
  opponent2?: MatchOpponent;
}

export class TournamentBracketInfoDto {
  participant: BracketParticipantDto[];
  stage: StageDto[];
  group: GroupDto[];
  round: RoundDto[];
  match: BracketMatchDto[];
}

export class BracketMatchDto {
  id: number;
  stage_id: number;
  group_id: number;
  round_id: number;
  child_count: number;
  number: number;
  status: MatchStatus;
  opponent1?: ParticipantResultDto;
  opponent2?: ParticipantResultDto;
  startDate: Date;
  games: MatchGameDto[];
}

export class ParticipantResultDto {
  /** If `null`, the participant is to be determined. */
  id: number | null;
  /** Indicates where the participant comes from. */
  position?: number;
  /** If this participant forfeits, the other automatically wins. */
  forfeit?: boolean;
  /** The current score of the participant. */
  score?: number;
  /** Tells what is the result of a duel for this participant. */
  result?: "win" | "draw" | "loss";

  tbd?: boolean;

  participant?: SmallParticipantDto;
}

export class BracketParticipantDto {
  id: number;
  tournament_id: number;
  // team?: TeamDto;
  players?: UserDTO[];
}

export class MatchGameDto {
  id: string;
  bracketMatchId: number;
  externalMatchId?: number;
  scheduledDate?: Date;
  teamOffset: number;
  number: number;
  status: MatchStatus;
  finished: boolean;
  opponent1?: ParticipantResultDto;
  opponent2?: ParticipantResultDto;
}

export class BracketMatchGameDto {
  id: string;
  bracket_match_id: number;
  number: number;
  externalMatchId?: number;
  teamOffset: number;
  finished: boolean;
  scheduledDate: Date;
}
