import { EventBus, EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { MatchFinishedEvent } from "../../gateway/events/match-finished.event";
import { SocketDelivery } from "../socket-delivery";
import { MessageTypeS2C } from "../messages/s2c/message-type.s2c";
import { PartyInvalidatedEvent } from "../event/party-invalidated.event";

@EventsHandler(MatchFinishedEvent)
export class MatchFinishedHandler implements IEventHandler<MatchFinishedEvent> {
  constructor(
    private readonly delivery: SocketDelivery,
    private readonly ebus: EventBus,
  ) {}

  async handle(event: MatchFinishedEvent) {
    const players = event.info.players.map((it) => it.steamId);

    this.ebus.publishAll(
      players.map((steamId) => new PartyInvalidatedEvent(steamId)),
    );

    await this.delivery.broadcastAuthorized(players, () => [
      MessageTypeS2C.PLAYER_GAME_STATE,
      undefined,
    ]);
  }
}
