import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { RoomNotReadyEvent } from "../../gateway/events/room-not-ready.event";
import { SocketDelivery } from "../socket-delivery";
import { MessageTypeS2C } from "../messages/s2c/message-type.s2c";

@EventsHandler(RoomNotReadyEvent)
export class RoomNotReadyHandler implements IEventHandler<RoomNotReadyEvent> {
  constructor(private delivery: SocketDelivery) {}

  async handle(event: RoomNotReadyEvent) {
    const ids = event.players.map((t) => t.value);
    await this.delivery.broadcastAuthorized(ids, () => [
      MessageTypeS2C.PLAYER_ROOM_STATE,
      undefined,
    ]);
  }
}
