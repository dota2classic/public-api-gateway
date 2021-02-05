import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TournamentApi } from '../../generated-api/tournament';
import { TOURNAMENT_APIURL } from '../../utils/env';
import { TournamentMapper } from '../admin/mapper/tournament.mapper';
import { TournamentDto } from '../admin/dto/admin-tournament.dto';

@Controller('tournament')
@ApiTags('tournament')
export class TournamentController {
  private readonly ms: TournamentApi;

  constructor(private readonly mapper: TournamentMapper) {
    this.ms = new TournamentApi(undefined, `http://${TOURNAMENT_APIURL}`);
  }


  @Get('list')
  public async listTournaments(): Promise<TournamentDto[]> {
    const res = await this.ms.tournamentControllerListTournaments();
    return res.data.map(this.mapper.mapTournament);
  }

  @Get(`/:id`)
  public async getTournament(@Param('id') id: number): Promise<TournamentDto> {
    return this.ms
      .tournamentControllerGetTournament(id)
      .then(d => this.mapper.mapTournament(d.data));
  }
}
