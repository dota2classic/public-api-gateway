import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TeamApi, TournamentApi } from '../../generated-api/tournament';
import { TOURNAMENT_APIURL } from '../../utils/env';
import { TournamentMapper } from '../admin/mapper/tournament.mapper';
import { FullTournamentDto, TournamentDto } from '../admin/dto/admin-tournament.dto';
import { CompactTeamDto } from './dto/team.dto';
import { CurrentUser, CurrentUserDto } from '../../utils/decorator/current-user';
import { WithOptionalUser } from '../../utils/decorator/with-optional-user';
import { WithUser } from '../../utils/decorator/with-user';
import { TournamentTournamentDtoStatusEnum } from '../../generated-api/tournament/models';
import { TournamentBracketInfoDto, TournamentBracketMatchDto } from './dto/bracket.dto';
import { BracketMapper } from '../admin/bracket.mapper';

@Controller('tournament')
@ApiTags('tournament')
export class TournamentController {
  private readonly ms: TournamentApi;
  private readonly ts: TeamApi;

  constructor(private readonly mapper: TournamentMapper, private readonly bracketMapper: BracketMapper) {
    this.ms = new TournamentApi(undefined, `http://${TOURNAMENT_APIURL}`);
    this.ts = new TeamApi(undefined, `http://${TOURNAMENT_APIURL}`);
  }

  @Post('join_as_player/:id')
  @WithUser()
  public async joinTournamentAsPlayer(
    @Param('id') id: number,
    @CurrentUser() user: CurrentUserDto,
  ) {
    await this.ms.tournamentControllerRegisterPlayer(id, user.steam_id);
  }

  @Post('leave_as_player/:id')
  @WithUser()
  public async leaveTournamentAsPlayer(
    @Param('id') id: number,
    @CurrentUser() user: CurrentUserDto,
  ) {
    await this.ms.tournamentControllerLeaveTournamentPlayer(id, user.steam_id);
  }

  @Get('list')
  public async listTournaments(): Promise<TournamentDto[]> {
    const res = await this.ms.tournamentControllerListTournaments();
    return res.data.filter(t => t.status !== TournamentTournamentDtoStatusEnum.CANCELLED).map(this.mapper.mapTournament);
  }

  @Get(`/bracket_new/:id`)
  public async getBracketNew(@Param('id') id: number): Promise<TournamentBracketInfoDto> {
    return this.ms
      .tournamentControllerGetBracket2(id)
      .then(d => this.bracketMapper.mapBracket(d.data));
  }

  @Get(`/teams/:id`)
  public async tournamentTeams(
    @Param('id') id: number,
  ): Promise<CompactTeamDto[]> {
    return this.ms
      .tournamentControllerTournamentTeams(id)
      .then(teams =>
        Promise.all(teams.data.map(t => this.mapper.mapTeamCompact(t))),
      );
  }





  @Get('tournament_match/:id')
  @WithOptionalUser()
  public async tournamentMatch(
    @Param('id') id: number,
  ): Promise<TournamentBracketMatchDto> {
    return this.ms
      .tournamentControllerGetTournamentMatch(id)
      .then(t => t.data)
      .then(this.bracketMapper.mapMatch);
  }



  @Get(`/:id`)
  @WithOptionalUser()
  public async getTournament(
    @Param('id') id: number,
    @CurrentUser() user?: CurrentUserDto,
  ): Promise<FullTournamentDto> {
    return this.ms
      .tournamentControllerGetTournament(id)
      .then(d => this.mapper.mapFullTournament(d.data, user));
  }
}
