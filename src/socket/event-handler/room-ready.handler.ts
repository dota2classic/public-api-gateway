import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { RoomReadyEvent } from "../../gateway/events/room-ready.event";
import { SocketDelivery } from "../socket-delivery";
import { MessageTypeS2C } from "../messages/s2c/message-type.s2c";
import { PlayerServerSearchingMessageS2C } from "../messages/s2c/player-server-searching-message.s2c";

@EventsHandler(RoomReadyEvent)
export class RoomReadyHandler implements IEventHandler<RoomReadyEvent> {
  constructor(private readonly deliver: SocketDelivery) {}

  async handle(event: RoomReadyEvent) {
    const ids = event.players.map((it) => it.playerId.value);

    await this.deliver.broadcastAuthorized(ids, () => [
      MessageTypeS2C.PLAYER_SERVER_SEARCHING,
      new PlayerServerSearchingMessageS2C(true),
    ]);
  }
}
