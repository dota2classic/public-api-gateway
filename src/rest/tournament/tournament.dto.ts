import {
  BracketType,
  MatchStatus,
  TournamentStatus,
} from "../../gateway/shared-types/tournament";
import { UserDTO } from "../shared.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Dota_GameMode } from "../../gateway/shared-types/dota-game-mode";

export enum TournamentRegistrationState {
  CREATED = "CREATED",
  PENDING_CONFIRMATION = "PENDING_CONFIRMATION",
  CONFIRMED = "CONFIRMED",
  DECLINED = "DECLINED",
  TIMED_OUT = "TIMED_OUT",
}

export enum OpponentResult {
  WIN = "win",
  LOSS = "loss",
  DRAW = "draw",
}

export class RegisterAsPartyDto {
  steamIds: string[];
}

export class ConfirmRegistrationDto {
  confirm: boolean;
}

export class ReplyInvitationDto {
  id: string;
  accept: boolean;
}

export class InviteToRegistrationDto {
  steamId: string;
}

export class BestOfStrategy {
  round: number;
  final: number;
  grandFinal: number;
}

export class ScheduleStrategy {
  gameDurationSeconds: number;
  gameBreakDurationSeconds: number;
}

export class TournamentDto {
  id: number;
  name: string;
  imageUrl: string;
  teamSize: number;

  @ApiProperty({ enum: TournamentStatus, enumName: "TournamentStatus" })
  status: TournamentStatus;

  @ApiProperty({ enum: BracketType, enumName: "BracketType" })
  strategy: BracketType;
  bestOfConfig: BestOfStrategy;
  startDate: string;
  description: string;
  prize: string;
  registrations: RegistrationDto[];

  @ApiProperty({ enum: Dota_GameMode, enumName: "Dota_GameMode" })
  gameMode: Dota_GameMode;

  scheduleStrategy: ScheduleStrategy;
}

export class CreateTournamentDto {
  name: string;
  teamSize: number;
  description: string;
  // Date
  startDate: string;
  imageUrl: string;
  prize: string;

  @ApiProperty({ enum: BracketType, enumName: "BracketType" })
  strategy: BracketType;
  roundBestOf: number;
  finalBestOf: number;
  grandFinalBestOf: number;

  @ApiProperty({ enum: Dota_GameMode, enumName: "Dota_GameMode" })
  gameMode: Dota_GameMode;

  gameDurationSeconds: number;
  gameBreakDurationSeconds: number;
}

export class UpdateTournamentDto {
  name?: string;
  description?: string;

  teamSize?: number;
  startDate?: string;
  imageUrl?: string;
  prize?: string;

  @ApiProperty({ enum: BracketType, enumName: "BracketType" })
  strategy?: BracketType;
  roundBestOf?: number;
  finalBestOf?: number;
  grandFinalBestOf?: number;

  @ApiProperty({ enum: Dota_GameMode, enumName: "Dota_GameMode" })
  gameMode?: Dota_GameMode;

  gameDurationSeconds?: number;
  gameBreakDurationSeconds?: number;
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
  title: string;
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

export class BracketParticipantDto {
  id: number;
  tournament_id: number;
  players?: UserDTO[];
  name?: string;
  avatar?: string;
}

export class ScheduleTournamentGameDto {
  gameId: string;
  scheduledDate: string;
}

export class ForfeitDto {
  gameId: number;
  forfeitId: string;
}

export class SetMatchResultDto {
  gameId: string;
  winnerId: number;
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
  @ApiProperty({ enum: OpponentResult, enumName: "OpponentResult" })
  result?: OpponentResult;
}

export class Match {
  id: number;
  number: number;
  stage_id: number;
  group_id: number;
  round_id: number;
  child_count: number;
  @ApiProperty({ enum: MatchStatus, enumName: "MatchStatus" })
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
  @ApiProperty({ enum: MatchStatus, enumName: "MatchStatus" })
  status: MatchStatus;
  opponent1?: ParticipantResultDto;
  opponent2?: ParticipantResultDto;
  startDate: string;
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
  @ApiProperty({ enum: OpponentResult, enumName: "OpponentResult" })
  result?: OpponentResult;

  tbd?: boolean;

  participant?: BracketParticipantDto;
}

export class MatchGameDto {
  id: string;
  bracketMatchId: number;
  externalMatchId?: number;
  scheduledDate?: string;
  teamOffset: number;
  number: number;
  @ApiProperty({ enum: MatchStatus, enumName: "MatchStatus" })
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
  scheduledDate: string;
}

export class StageStandingRankedDto {
  rank: number;
  participant: BracketParticipantDto;
}

export class StageStandingsDto {
  name: string;
  id: number;
  standings: StageStandingRankedDto[];
}
