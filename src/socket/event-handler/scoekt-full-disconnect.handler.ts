import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { SocketFullDisconnectEvent } from "../event/socket-full-disconnect.event";
import { Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { PlayerLeaveQueueRequestedEvent } from "../../gateway/events/mm/player-leave-queue-requested.event";

@EventsHandler(SocketFullDisconnectEvent)
export class SocketFullDisconnectHandler
  implements IEventHandler<SocketFullDisconnectEvent>
{
  constructor(@Inject("QueryCore") private readonly redis: ClientProxy) {}

  async handle(event: SocketFullDisconnectEvent) {
    await this.redis
      .emit(
        PlayerLeaveQueueRequestedEvent.name,
        new PlayerLeaveQueueRequestedEvent(event.steamId),
      )
      .toPromise();
  }
}
