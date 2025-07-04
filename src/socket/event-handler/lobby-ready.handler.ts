import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { SocketDelivery } from "../socket-delivery";
import { MessageTypeS2C } from "../messages/s2c/message-type.s2c";
import { PlayerServerSearchingMessageS2C } from "../messages/s2c/player-server-searching-message.s2c";
import { LobbyReadyEvent } from "../../gateway/events/lobby-ready.event";

@EventsHandler(LobbyReadyEvent)
export class LobbyReadyHandler implements IEventHandler<LobbyReadyEvent> {
  constructor(private readonly deliver: SocketDelivery) {}

  async handle(event: LobbyReadyEvent) {
    const ids = event.players.map((it) => it.playerId.value);

    await this.deliver.broadcastAuthorized(ids, () => [
      MessageTypeS2C.PLAYER_SERVER_SEARCHING,
      new PlayerServerSearchingMessageS2C(true),
    ]);
  }
}
