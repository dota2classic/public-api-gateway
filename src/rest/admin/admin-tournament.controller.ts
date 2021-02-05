import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTournamentDto } from './dto/admin-tournament.dto';
import { TournamentApi } from '../../generated-api/tournament';
import { TOURNAMENT_APIURL } from '../../utils/env';
import { TournamentMapper } from './mapper/tournament.mapper';

@Controller(`admin/tournament`)
@ApiTags(`adminTournament`)
export class AdminTournamentController {
  private ms: TournamentApi;

  constructor(private readonly mapper: TournamentMapper) {
    this.ms = new TournamentApi(undefined, `http://${TOURNAMENT_APIURL}`);
  }

  @Post(`create_tournament`)
  public async createTournament(@Body() dto: CreateTournamentDto) {
    const res = await this.ms.tournamentControllerCreateTournament({
      name: dto.name,
      entryType: dto.entryType as any,
      startDate: dto.startDate,
      imageUrl: dto.imageUrl
    });

    return this.mapper.mapTournament(res.data);
  }
}
