import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PlayerPleaseGoQueueEvent } from "../../notification/event/player-please-go-queue.event";
import { SocketDelivery } from "../socket-delivery";
import { MessageTypeS2C } from "../messages/s2c/message-type.s2c";
import { PleaseEnterQueueMessageS2C } from "../messages/s2c/please-enter-queue-message.s2c";
import { Dota2Version } from "../../gateway/shared-types/dota2version";

@EventsHandler(PlayerPleaseGoQueueEvent)
export class PlayerPleaseGoQueueHandler
  implements IEventHandler<PlayerPleaseGoQueueEvent>
{
  constructor(private readonly delivery: SocketDelivery) {}

  async handle(event: PlayerPleaseGoQueueEvent) {
    await this.delivery.deliver(
      event.steamId,
      MessageTypeS2C.GO_QUEUE,
      new PleaseEnterQueueMessageS2C(event.mode, Dota2Version.Dota_684, event.inQueue),
    );
  }
}
