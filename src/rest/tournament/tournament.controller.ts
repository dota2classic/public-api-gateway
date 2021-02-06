import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TeamApi, TournamentApi } from '../../generated-api/tournament';
import { TOURNAMENT_APIURL } from '../../utils/env';
import { TournamentMapper } from '../admin/mapper/tournament.mapper';
import { TournamentDto } from '../admin/dto/admin-tournament.dto';
import { BracketDto, BracketRoundDto } from './dto/tournament.dto';
import { CompactTeamDto, TeamDto } from './dto/team.dto';

@Controller('tournament')
@ApiTags('tournament')
export class TournamentController {
  private readonly ms: TournamentApi;
  private readonly ts: TeamApi;

  constructor(private readonly mapper: TournamentMapper) {
    this.ms = new TournamentApi(undefined, `http://${TOURNAMENT_APIURL}`);
    this.ts = new TeamApi(undefined, `http://${TOURNAMENT_APIURL}`);
  }

  @Get('list')
  public async listTournaments(): Promise<TournamentDto[]> {
    const res = await this.ms.tournamentControllerListTournaments();
    return res.data.map(this.mapper.mapTournament);
  }

  @Get(`/bracket/:id`)
  public async getBracket(@Param('id') id: number): Promise<BracketDto> {
    return this.ms
      .tournamentControllerGetBracket(id)
      .then(d => this.mapper.mapBracket(d.data));
  }

  @Get(`/teams/:id`)
  public async tournamentTeams(@Param('id') id: number): Promise<CompactTeamDto[]> {
    return this.ms
      .tournamentControllerTournamentTeams(id)
      .then(teams => Promise.all(teams.data.map(t => this.mapper.mapTeamCompact(t))));
  }

  @Get(`/:id`)
  public async getTournament(@Param('id') id: number): Promise<TournamentDto> {
    return this.ms
      .tournamentControllerGetTournament(id)
      .then(d => this.mapper.mapTournament(d.data));
  }
}
