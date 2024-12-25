import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { SocketFullDisconnectEvent } from "../../../socket/event/socket-full-disconnect.event";
import { LobbyService } from "../lobby.service";

@EventsHandler(SocketFullDisconnectEvent)
export class LeaveLobbySocketDisconnectHandler
  implements IEventHandler<SocketFullDisconnectEvent>
{
  constructor(private readonly lobbyService: LobbyService) {}

  async handle(event: SocketFullDisconnectEvent) {
    await this.lobbyService.leaveLobbyIfAny(event.steamId);
  }
}
