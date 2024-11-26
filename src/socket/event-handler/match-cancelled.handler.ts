import { EventBus, EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { MatchCancelledEvent } from "../../gateway/events/match-cancelled.event";
import { MessageTypeS2C } from "../messages/s2c/message-type.s2c";
import { SocketDelivery } from "../socket-delivery";
import { PartyInvalidatedEvent } from "../event/party-invalidated.event";

@EventsHandler(MatchCancelledEvent)
export class MatchCancelledHandler
  implements IEventHandler<MatchCancelledEvent>
{
  constructor(
    private readonly delivery: SocketDelivery,
    private readonly ebus: EventBus,
  ) {}

  async handle(event: MatchCancelledEvent) {
    const players = event.info.players.map((it) => it.playerId.value);
    this.ebus.publishAll(
      players.map((steamId) => new PartyInvalidatedEvent(steamId)),
    );

    await this.delivery.broadcastAuthorized(players, () => [
      MessageTypeS2C.PLAYER_GAME_STATE,
      undefined,
    ]);
  }
}
