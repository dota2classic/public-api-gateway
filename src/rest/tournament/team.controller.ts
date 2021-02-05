import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TeamDto } from './dto/team.dto';
import { TournamentMapper } from '../admin/mapper/tournament.mapper';
import { TeamApi, TournamentApi } from '../../generated-api/tournament';
import { TOURNAMENT_APIURL } from '../../utils/env';

@Controller('team')
@ApiTags('team')
export class TeamController {
  private readonly ms: TeamApi;

  constructor(private readonly mapper: TournamentMapper) {
    this.ms = new TeamApi(undefined, `http://${TOURNAMENT_APIURL}`);
  }

  @Get(`list`)
  public async listTeams(): Promise<TeamDto[]> {
    const teams = await this.ms.teamControllerListTeams().then(t => t.data);

    return Promise.all(teams.map(t => this.mapper.mapTeam(t)));
  }
}
