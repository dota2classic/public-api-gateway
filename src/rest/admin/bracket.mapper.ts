import { Injectable } from '@nestjs/common';
import {
  TournamentBracketInfoDto,
  TournamentBracketMatchDto,
  TournamentBracketParticipantDto,
} from '../tournament/dto/bracket.dto';
import {
  TournamentBracketMatchDto as TournamentTournamentBracketMatchDto,
  TournamentBracketParticipantDto as TournamentTournamentBracketParticipantDto,
  TournamentTournamentBracketInfoDto,


} from '../../generated-api/tournament/models';
import { TournamentMapper } from './mapper/tournament.mapper';
import { inspect } from 'util';

@Injectable()
export class BracketMapper {
  constructor(private readonly mapper: TournamentMapper) {}

  private mapParticipant = async (
    part: TournamentTournamentBracketParticipantDto,
  ): Promise<TournamentBracketParticipantDto | undefined> => {
    if (part.steam_id) {
      // profile
      return {
        id: part.id,
        tournament_id: part.tournament_id,
        profile: await this.mapper.mapPlayerPreview(part.steam_id),
      };
    } else if (part.team) {
      return {
        id: part.id,
        tournament_id: part.tournament_id,
        team: await this.mapper.mapTeam(part.team),
      };
    } else {
     return undefined;
    }
  };

  public mapMatch = async (
    t: TournamentTournamentBracketMatchDto,
  ): Promise<TournamentBracketMatchDto> => {
    return {
      id: t.id,
      stage_id: t.stage_id,
      group_id: t.group_id,
      round_id: t.round_id,
      child_count: t.child_count,
      number: t.number,
      startDate: t.startDate,
      status: t.status,
      opponent1: t.opponent1 && {
        ...t.opponent1,
        result: t.opponent1.result as any,
        participant: (await this.mapParticipant(t.opponent1.participant)) || undefined
      },
      opponent2: t.opponent2 && {
        ...t.opponent2,
        result: t.opponent2.result as any,
        participant: (await this.mapParticipant(t.opponent2.participant)) || undefined
      },
      games: t.games,
    };
  };


  mapBracket = async (
    data: TournamentTournamentBracketInfoDto,
  ): Promise<TournamentBracketInfoDto> => {
    return {
      participant: await Promise.all(data.participant.map(this.mapParticipant)),
      stage: data.stage,
      group: data.group,
      round: data.round,
      match: await Promise.all(data.match.map(this.mapMatch)),
    };
  };
}
