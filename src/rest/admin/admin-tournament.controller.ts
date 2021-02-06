import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateTournamentDto,
  StartTournamentDto,
  TournamentDto,
} from './dto/admin-tournament.dto';
import { TournamentApi } from '../../generated-api/tournament';
import { TOURNAMENT_APIURL } from '../../utils/env';
import { TournamentMapper } from './mapper/tournament.mapper';
import {
  AdminGuard,
  ModeratorGuard,
  WithUser,
} from '../../utils/decorator/with-user';
import {
  CurrentUser,
  CurrentUserDto,
} from '../../utils/decorator/current-user';

@Controller(`admin/tournament`)
@ApiTags(`adminTournament`)
export class AdminTournamentController {
  private ms: TournamentApi;

  constructor(private readonly mapper: TournamentMapper) {
    this.ms = new TournamentApi(undefined, `http://${TOURNAMENT_APIURL}`);
  }

  @ModeratorGuard()
  @WithUser()
  @Post(`create_tournament`)
  public async createTournament(@Body() dto: CreateTournamentDto) {
    const res = await this.ms.tournamentControllerCreateTournament({
      name: dto.name,
      entryType: dto.entryType as any,
      startDate: dto.startDate,
      imageUrl: dto.imageUrl,
      strategy: dto.strategy as any,
    });

    return this.mapper.mapTournament(res.data as any);
  }

  @ModeratorGuard()
  @WithUser()
  @Post(`start_tournament`)
  public async startTournament(@Body() dto: StartTournamentDto) {
    await this.ms.tournamentControllerStartTournament(dto.id);
  }

  @ModeratorGuard()
  @WithUser()
  @Post(`cancel_tournament`)
  public async cancelTournament(@Body() dto: StartTournamentDto) {
    await this.ms.tournamentControllerCancelTournament(dto.id);
  }

  @ModeratorGuard()
  @WithUser()
  @Get('list')
  public async listTournaments(
    @CurrentUser() user: CurrentUserDto,
  ): Promise<TournamentDto[]> {
    return this.ms
      .tournamentControllerListTournaments()
      .then(t => t.data)
      .then(t => t.map(t => this.mapper.mapTournament(t)));
  }

  @ModeratorGuard()
  @WithUser()
  @Get('get/:id')
  public async getTournament(@Param('id') id: number): Promise<TournamentDto> {
    return this.ms
      .tournamentControllerGetTournament(id)
      .then(t => t.data)
      .then(this.mapper.mapTournament as any);
  }
}
