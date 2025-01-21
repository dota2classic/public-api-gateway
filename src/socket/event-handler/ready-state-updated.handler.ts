import { ReadyStateUpdatedEvent } from "../../gateway/events/ready-state-updated.event";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { SocketDelivery } from "../socket-delivery";
import { MessageTypeS2C } from "../messages/s2c/message-type.s2c";
import {
  PlayerRoomEntry,
  PlayerRoomStateMessageS2C,
} from "../messages/s2c/player-room-state-message.s2c";

@EventsHandler(ReadyStateUpdatedEvent)
export class ReadyStateUpdatedHandler
  implements IEventHandler<ReadyStateUpdatedEvent>
{
  constructor(private readonly delivery: SocketDelivery) {}

  async handle(event: ReadyStateUpdatedEvent) {
    const state = new PlayerRoomStateMessageS2C(
      event.roomID,
      event.mode,
      event.entries.map(
        (entry) => new PlayerRoomEntry(entry.steamId, entry.readyState),
      ),
    );

    await this.delivery.broadcastAuthorized(
      event.entries.map((it) => it.steamId),
      () => [MessageTypeS2C.PLAYER_ROOM_STATE, state],
    );
  }
}
