import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PlayerDeclinedGameEvent } from "../../gateway/events/mm/player-declined-game.event";
import { SocketDelivery } from "../socket-delivery";
import { MessageTypeS2C } from "../messages/s2c/message-type.s2c";
import { PlayerDeclineGameMessageS2C } from "../messages/s2c/player-decline-game-message.s2c";

@EventsHandler(PlayerDeclinedGameEvent)
export class PlayerDeclinedGameHandler
  implements IEventHandler<PlayerDeclinedGameEvent>
{
  constructor(private readonly delivery: SocketDelivery) {}

  async handle(event: PlayerDeclinedGameEvent) {
    await this.delivery.deliver(
      event.steamId,
      MessageTypeS2C.PLAYER_DECLINE_GAME,
      new PlayerDeclineGameMessageS2C(event.mode, event.reason),
    );
  }
}
