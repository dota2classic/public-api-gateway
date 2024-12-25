import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { SocketFullDisconnectEvent } from "../event/socket-full-disconnect.event";
import { PlayerId } from "../../gateway/shared-types/player-id";
import { MatchmakingModes } from "../../gateway/shared-types/matchmaking-mode";
import { PlayerLeaveQueueCommand } from "../../gateway/commands/player-leave-queue.command";
import { Dota2Version } from "../../gateway/shared-types/dota2version";
import { Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@EventsHandler(SocketFullDisconnectEvent)
export class SocketFullDisconnectHandler
  implements IEventHandler<SocketFullDisconnectEvent>
{
  constructor(@Inject("QueryCore") private readonly redis: ClientProxy) {}

  async handle(event: SocketFullDisconnectEvent) {
    const cmds = MatchmakingModes.flatMap((mode) => [
      this.redis
        .emit(
          PlayerLeaveQueueCommand.name,
          new PlayerLeaveQueueCommand(
            new PlayerId(event.steamId),
            mode,
            Dota2Version.Dota_681,
          ),
        )
        .toPromise(),
      this.redis
        .emit(
          PlayerLeaveQueueCommand.name,
          new PlayerLeaveQueueCommand(
            new PlayerId(event.steamId),
            mode,
            Dota2Version.Dota_684,
          ),
        )
        .toPromise(),
    ]);
    return Promise.all(cmds);
  }
}
