import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WithUser } from '../../utils/decorator/with-user';
import { CurrentUser } from '../../utils/decorator/current-user';
import { Configuration, InfoApi } from '../../generated-api/gameserver';
import { GAMESERVER_APIURL } from '../../utils/env';
import { CurrentOnlineDto, MatchmakingInfo } from './dto/stats.dto';
import { MatchmakingModeStatusEntity } from '../../entity/matchmaking-mode-status.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CacheTTL } from '@nestjs/cache-manager';

@Controller('stats')
@ApiTags('stats')
export class StatsController {
  private readonly ms: InfoApi;

  constructor(
    @InjectRepository(MatchmakingModeStatusEntity)
    private readonly matchmakingModeStatusEntityRepository: Repository<
      MatchmakingModeStatusEntity
    >,
  ) {
    this.ms = new InfoApi(
      new Configuration({ basePath: `http://${GAMESERVER_APIURL}` }),
    );
  }

  @Get('/matchmaking')
  async getMatchmakingInfo(): Promise<MatchmakingInfo[]> {
    return this.matchmakingModeStatusEntityRepository.find();
  }

  @Get('/online')
  @WithUser()
  @CacheTTL(10)
  async online(@CurrentUser() user): Promise<CurrentOnlineDto> {
    const online = await this.ms.infoControllerGetCurrentOnline();
    const sessions = await this.ms.infoControllerGameSessions();
    const servers = await this.ms.infoControllerGameServers();

    return {
      inGame: online,
      servers: servers.length,
      sessions: sessions.length,
    };
  }
}
