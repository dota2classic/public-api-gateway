import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { EventAdminDto, GameServerDto, GameSessionDto } from './dto/admin.dto';
import { ClientProxy } from '@nestjs/microservices';
import { AdminGuard, WithUser } from '../../utils/decorator/with-user';
import { QueryBus } from '@nestjs/cqrs';
import { GAMESERVER_APIURL } from '../../utils/env';
import { InfoApi } from 'src/generated-api/gameserver/api/info-api';
import { AdminMapper } from './admin.mapper';
import { ApiTags } from '@nestjs/swagger';

@Controller('admin')
@ApiTags('admin')
export class AdminController {
  private readonly ms: InfoApi;
  constructor(
    @Inject('QueryCore') private readonly rq: ClientProxy,
    private readonly qBus: QueryBus,
    private readonly mapper: AdminMapper,
  ) {
    this.ms = new InfoApi(undefined, `http://${GAMESERVER_APIURL}`);
  }

  @AdminGuard()
  @WithUser()
  @Get('/server_pool')
  async serverPool(): Promise<GameServerDto[]> {
    return this.ms
      .infoControllerGameServers()
      .then(t => t.data.map(this.mapper.mapGameServer));
  }


  @AdminGuard()
  @WithUser()
  @Get('/live_sessions')
  async liveSessions(): Promise<GameSessionDto[]> {
    return this.ms
      .infoControllerGameSessions()
      .then(t => t.data.map(this.mapper.mapGameSession));
  }

  @AdminGuard()
  @WithUser()
  @Post('/debug_event')
  async match(@Body() b: EventAdminDto) {
    this.rq.emit(b.name, b.body);
  }
}
