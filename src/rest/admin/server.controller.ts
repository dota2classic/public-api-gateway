import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import {
  EventAdminDto,
  GameServerDto,
  GameSessionDto,
  QueueStateDTO,
  StopServerDto,
} from './dto/admin.dto';
import { ClientProxy } from '@nestjs/microservices';
import { EventBus, QueryBus } from '@nestjs/cqrs';
import { GAMESERVER_APIURL } from '../../utils/env';
import { AdminMapper } from './admin.mapper';
import { ApiTags } from '@nestjs/swagger';
import { KillServerRequestedEvent } from '../../gateway/events/gs/kill-server-requested.event';
import { timeout } from 'rxjs/operators';
import { Configuration, InfoApi } from '../../generated-api/gameserver';
import { GetQueueStateQuery } from '../../gateway/queries/QueueState/get-queue-state.query';
import { MatchmakingMode, MatchmakingModes } from '../../gateway/shared-types/matchmaking-mode';
import { Dota2Version } from '../../gateway/shared-types/dota2version';
import { GetQueueStateQueryResult } from '../../gateway/queries/QueueState/get-queue-state-query.result';
import { UserRepository } from '../../cache/user/user.repository';

@Controller('servers')
@ApiTags('admin')
export class ServerController {
  private readonly ms: InfoApi;
  constructor(
    @Inject('QueryCore') private readonly rq: ClientProxy,
    private readonly qBus: QueryBus,
    private readonly urepo: UserRepository,
    private readonly mapper: AdminMapper,
    private readonly ebus: EventBus,
  ) {
    this.ms = new InfoApi(
      new Configuration({ basePath: `http://${GAMESERVER_APIURL}` }),
    );
  }

  @Get('/queues')
  async queues(): Promise<QueueStateDTO[]> {
    const some = await Promise.all(
      MatchmakingModes.map((mode: MatchmakingMode) =>
        this.qBus.execute<GetQueueStateQuery, GetQueueStateQueryResult>(
          new GetQueueStateQuery(mode, Dota2Version.Dota_684),
        ),
      ),
    );

    return Promise.all(
      some.map(async t => {
        const k: QueueStateDTO = {
          mode: t.mode,
          entries: await Promise.all(
            t.entries.map(async entry => ({
              partyId: entry.partyID,
              players: await Promise.all(
                entry.players.map(x => this.urepo.userDto(x.value)),
              ),
            })),
          ),
        };
        return k;
      }),
    );
  }

  // @ModeratorGuard()
  // @WithUser()
  @Get('/server_pool')
  async serverPool(): Promise<GameServerDto[]> {
    return this.ms
      .infoControllerGameServers()
      .then(t => t.map(this.mapper.mapGameServer));
  }

  // @AdminGuard()
  // @WithUser()
  @Post(`/stop_server`)
  async stopServer(@Body() url: StopServerDto) {
    console.log('sad kek');
    this.rq.emit(
      KillServerRequestedEvent.name,
      new KillServerRequestedEvent(url.url),
    );
  }

  // @ModeratorGuard()
  // @WithUser()
  @Get('/live_sessions')
  async liveSessions(): Promise<GameSessionDto[]> {
    const res = await this.ms.infoControllerGameSessions();

    return Promise.all(res.map(async t => this.mapper.mapGameSession(t)));
  }

  // @AdminGuard()
  // @WithUser()
  @Post('/debug_event')
  async debugEvent(@Body() b: EventAdminDto) {
    await this.rq.emit(b.name, b.body).toPromise();
  }

  // @AdminGuard()
  // @WithUser()
  @Post('/debug_command')
  async debugCommand(@Body() b: EventAdminDto) {
    return await this.rq
      .send(b.name, b.body)
      .pipe(timeout(1000))
      .toPromise();
  }
}
