import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { MatchCancelledEvent } from "../../gateway/events/match-cancelled.event";
import { MessageTypeS2C } from "../messages/s2c/message-type.s2c";
import { SocketDelivery } from "../socket-delivery";

@EventsHandler(MatchCancelledEvent)
export class MatchCancelledHandler
  implements IEventHandler<MatchCancelledEvent>
{
  constructor(private readonly delivery: SocketDelivery) {}

  async handle(event: MatchCancelledEvent) {
    const players = event.info.players.map((it) => it.playerId.value);

    await this.delivery.broadcastAuthorized(players, () => [
      MessageTypeS2C.PLAYER_GAME_STATE,
      undefined,
    ]);
  }
}
