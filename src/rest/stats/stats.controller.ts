import { CacheTTL, Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WithUser } from '../../utils/decorator/with-user';
import { CurrentUser } from '../../utils/decorator/current-user';
import { MeDto } from '../player/dto/player.dto';
import { Dota2Version } from '../../gateway/shared-types/dota2version';
import { InfoApi, PlayerApi } from '../../generated-api/gameserver';
import { GAMESERVER_APIURL } from '../../utils/env';
import { CurrentOnlineDto } from './dto/stats.dto';

@Controller('stats')
@ApiTags('stats')
export class StatsController {
  private readonly ms: InfoApi;


  constructor() {
    this.ms = new InfoApi(undefined, `http://${GAMESERVER_APIURL}`);
  }

  @Get('/online')
  @WithUser()
  @CacheTTL(10)
  async online(@CurrentUser() user): Promise<CurrentOnlineDto> {


    const online = await this.ms.infoControllerGetCurrentOnline();
    const sessions = await this.ms.infoControllerGameSessions();
    const servers = await this.ms.infoControllerGameServers();


    return {
      inGame: online.data,
      servers: servers.data.length,
      sessions: sessions.data.length,
    }
  }


}
