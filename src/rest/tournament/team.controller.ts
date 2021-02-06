import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTeamDto, TeamDto } from './dto/team.dto';
import { TournamentMapper } from '../admin/mapper/tournament.mapper';
import { TeamApi } from '../../generated-api/tournament';
import { TOURNAMENT_APIURL } from '../../utils/env';
import { OldGuard, WithUser } from '../../utils/decorator/with-user';
import {
  CurrentUser,
  CurrentUserDto,
} from '../../utils/decorator/current-user';
import { TournamentDto } from '../admin/dto/admin-tournament.dto';

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

  @Post(`create_team`)
  @OldGuard()
  @WithUser()
  public async createTeam(
    @CurrentUser() user: CurrentUserDto,
    @Body() dto: CreateTeamDto,
  ): Promise<TeamDto> {
    const res = await this.ms.teamControllerCreateTeam({
      name: dto.name,
      imageUrl: dto.imageUrl,
      tag: dto.tag,
      creator: user.steam_id,
    });

    return this.mapper.mapTeam(res.data);
  }

  @Get(`tournament_list/:id`)
  public async getTeamTournaments(
    @Param('id') id: string,
  ): Promise<TournamentDto[]> {
    return this.ms
      .teamControllerGetTournaments(id)
      .then(t => t.data)
      .then(z => z.map(this.mapper.mapTournament));
  }

  @Get(`view/:id`)
  public async getTeam(@Param('id') id: string): Promise<TeamDto> {
    const team = await this.ms.teamControllerGetTeam(id);
    return this.mapper.mapTeam(team.data);
  }
}
