import { CacheInterceptor, Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Dota2Version } from '../../gateway/shared-types/dota2version';
import { PlayerApi } from '../../generated-api/gameserver';
import { GAMESERVER_APIURL } from '../../utils/env';
import { PlayerMapper } from './player.mapper';
import { LeaderboardEntryDto } from './dto/player.dto';

@Controller('player')
@ApiTags('player')
export class PlayerController {
  private ms: PlayerApi;

  constructor(private readonly mapper: PlayerMapper) {
    this.ms = new PlayerApi(undefined, `http://${GAMESERVER_APIURL}`);
  }

  @ApiQuery({ required: false, name: 'version' })
  @Get('/leaderboard')
  async leaderboard(
    @Query('version') version: Dota2Version = Dota2Version.Dota_681,
  ): Promise<LeaderboardEntryDto[]> {
    const rawData = await this.ms.playerControllerLeaderboard(version);
    return Promise.all(rawData.data.map(this.mapper.mapLeaderboardEntry));
  }
}
