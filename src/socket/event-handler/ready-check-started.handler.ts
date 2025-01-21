import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ReadyCheckStartedEvent } from "../../gateway/events/ready-check-started.event";
import {
  PlayerRoomEntry,
  PlayerRoomStateMessageS2C,
} from "../messages/s2c/player-room-state-message.s2c";
import { MessageTypeS2C } from "../messages/s2c/message-type.s2c";
import { SocketDelivery } from "../socket-delivery";

@EventsHandler(ReadyCheckStartedEvent)
export class ReadyCheckStartedHandler
  implements IEventHandler<ReadyCheckStartedEvent>
{
  constructor(private readonly delivery: SocketDelivery) {}

  async handle(event: ReadyCheckStartedEvent) {
    const state = new PlayerRoomStateMessageS2C(
      event.roomId,
      event.mode,
      event.entries.map(
        (entry) => new PlayerRoomEntry(entry.steamId, entry.readyState),
      ),
    );

    await this.delivery.broadcastAuthorized(
      event.entries.map((it) => it.steamId),
      () => [MessageTypeS2C.PLAYER_ROOM_FOUND, state],
    );
  }
}
