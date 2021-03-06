import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import {
  EventAdminDto,
  GameServerDto,
  GameSessionDto,
  StopServerDto,
} from './dto/admin.dto';
import { ClientProxy } from '@nestjs/microservices';
import {
  AdminGuard,
  ModeratorGuard,
  WithUser,
} from '../../utils/decorator/with-user';
import { EventBus, QueryBus } from '@nestjs/cqrs';
import { GAMESERVER_APIURL } from '../../utils/env';
import { InfoApi } from 'src/generated-api/gameserver/api/info-api';
import { AdminMapper } from './admin.mapper';
import { ApiTags } from '@nestjs/swagger';
import { KillServerRequestedEvent } from '../../gateway/events/gs/kill-server-requested.event';
import { construct } from '../../gateway/util/construct';
import { LiveMatchUpdateEvent } from '../../gateway/events/gs/live-match-update.event';

@Controller('servers')
@ApiTags('admin')
export class ServerController {
  private readonly ms: InfoApi;
  constructor(
    @Inject('QueryCore') private readonly rq: ClientProxy,
    private readonly qBus: QueryBus,
    private readonly mapper: AdminMapper,
    private readonly ebus: EventBus,
  ) {
    this.ms = new InfoApi(undefined, `http://${GAMESERVER_APIURL}`);
  }

  @ModeratorGuard()
  @WithUser()
  @Get('/server_pool')
  async serverPool(): Promise<GameServerDto[]> {
    return this.ms
      .infoControllerGameServers()
      .then(t => t.data.map(this.mapper.mapGameServer));
  }

  @AdminGuard()
  @WithUser()
  @Post(`/stop_server`)
  async stopServer(@Body() url: StopServerDto) {
    console.log('sad kek');
    this.rq.emit(
      KillServerRequestedEvent.name,
      new KillServerRequestedEvent(url.url),
    );
  }

  @ModeratorGuard()
  @WithUser()
  @Get('/live_sessions')
  async liveSessions(): Promise<GameSessionDto[]> {
    const res = await this.ms.infoControllerGameSessions();

    return Promise.all(res.data.map(async t => this.mapper.mapGameSession(t)));
  }

  @AdminGuard()
  @WithUser()
  @Post('/debug_event')
  async debugEvent(@Body() b: EventAdminDto) {
    await this.rq.emit(b.name, b.body).toPromise();
    console.log('Emitted');
  }
}
