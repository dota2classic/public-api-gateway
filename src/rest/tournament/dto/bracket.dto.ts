import {
   TournamentBracketMatchDtoStatusEnum,
  TournamentGroupEntity, TournamentRoundEntity,
  TournamentStageEntity,
} from '../../../generated-api/tournament/models';
import { PlayerPreviewDto } from '../../player/dto/player.dto';
import { TeamDto } from './team.dto';

export class TournamentBracketInfoDto {
  participant: TournamentBracketParticipantDto[];
  stage: TournamentStageEntity[];
  group: TournamentGroupEntity[];
  round: TournamentRoundEntity[];
  match: TournamentBracketMatchDto[];
}


export class TournamentBracketParticipantDto {
  id: number;
  tournament_id: number;
  profile?: PlayerPreviewDto;
  team?: TeamDto;
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
  result?: string;

  participant?: TournamentBracketParticipantDto
}


export class TournamentBracketMatchDto {
  id: number;
  stage_id: number;
  group_id: number;
  round_id: number;
  child_count: number;
  number: number;
  startDate: number;
  status: TournamentBracketMatchDtoStatusEnum;
  opponent1?: ParticipantResultDto;
  opponent2?: ParticipantResultDto;
  games: TournamentBracketMatchGameDto[];
}


export class TournamentBracketMatchGameDto {
  id: number;
  bm_id: number;
  number: number;
  externalMatchId?: number;
  teamOffset: number;
  scheduledDate: number;
}
