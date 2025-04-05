import { Body, Controller, Get, Inject, Post } from "@nestjs/common";
import {
  EventAdminDto,
  GameServerDto,
  GameSessionDto,
  QueueEntryDTO,
  StopServerDto,
} from "./dto/admin.dto";
import { ClientProxy } from "@nestjs/microservices";
import { EventBus, QueryBus } from "@nestjs/cqrs";
import { AdminMapper } from "./admin.mapper";
import { ApiTags } from "@nestjs/swagger";
import { KillServerRequestedEvent } from "../../gateway/events/gs/kill-server-requested.event";
import { timeout } from "rxjs/operators";
import { InfoApi } from "../../generated-api/gameserver";
import { GetQueueStateQuery } from "../../gateway/queries/QueueState/get-queue-state.query";
import { Dota2Version } from "../../gateway/shared-types/dota2version";
import { GetQueueStateQueryResult } from "../../gateway/queries/QueueState/get-queue-state-query.result";
import { UserRepository } from "../../cache/user/user.repository";
import {
  AdminGuard,
  ModeratorGuard,
  WithUser,
} from "../../utils/decorator/with-user";
import { MatchmakingMode } from "../../gateway/shared-types/matchmaking-mode";

@Controller("servers")
@ApiTags("admin")
export class ServerController {
  constructor(
    @Inject("QueryCore") private readonly rq: ClientProxy,
    private readonly qBus: QueryBus,
    private readonly urepo: UserRepository,
    private readonly mapper: AdminMapper,
    private readonly ebus: EventBus,
    private readonly ms: InfoApi,
  ) {}

  @Get("ohbabystasik")
  async fdf() {
    const some = await this.qBus.execute<
      GetQueueStateQuery,
      GetQueueStateQueryResult
    >(new GetQueueStateQuery(Dota2Version.Dota_684));
    const plrs = some.entries
      .filter((t) => t.modes.includes(MatchmakingMode.UNRANKED))
      .flatMap((it) => it.players);

    return (await Promise.all(plrs.map(this.urepo.userDto))).map(
      (it) => it.name,
    );
  }

  @Get("/queues")
  async queues(): Promise<QueueEntryDTO[]> {
    const some = await this.qBus.execute<
      GetQueueStateQuery,
      GetQueueStateQueryResult
    >(new GetQueueStateQuery(Dota2Version.Dota_684));

    return Promise.all(
      some.entries.map(async (entry) => {
        return {
          partyId: entry.partyID,
          modes: entry.modes,
          players: await Promise.all(entry.players.map(this.urepo.userDto)),
        };
      }),
    );
  }

  @ModeratorGuard()
  @WithUser()
  @Get("/server_pool")
  async serverPool(): Promise<GameServerDto[]> {
    return this.ms
      .infoControllerGameServers()
      .then((t) => t.map(this.mapper.mapGameServer));
  }

  @ModeratorGuard()
  @WithUser()
  @Post(`/stop_server`)
  async stopServer(@Body() url: StopServerDto) {
    this.rq.emit(
      KillServerRequestedEvent.name,
      new KillServerRequestedEvent(url.url),
    );
  }

  @ModeratorGuard()
  @WithUser()
  @Get("/live_sessions")
  async liveSessions(): Promise<GameSessionDto[]> {
    const res = await this.ms.infoControllerGameSessions();

    return Promise.all(res.map(async (t) => this.mapper.mapGameSession(t)));
  }

  @AdminGuard()
  @WithUser()
  @Post("/debug_event")
  async debugEvent(@Body() b: EventAdminDto) {
    await this.rq.emit(b.name, b.body).toPromise();
  }

  @AdminGuard()
  @WithUser()
  @Post("/debug_command")
  async debugCommand(@Body() b: EventAdminDto) {
    return await this.rq.send(b.name, b.body).pipe(timeout(1000)).toPromise();
  }
}
