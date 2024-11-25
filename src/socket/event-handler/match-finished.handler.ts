import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { MatchFinishedEvent } from "../../gateway/events/match-finished.event";
import { SocketDelivery } from "../socket-delivery";
import { MessageTypeS2C } from "../messages/s2c/message-type.s2c";

@EventsHandler(MatchFinishedEvent)
export class MatchFinishedHandler implements IEventHandler<MatchFinishedEvent> {
  constructor(private readonly delivery: SocketDelivery) {}

  async handle(event: MatchFinishedEvent) {
    const players = event.info.players.map((it) => it.playerId.value);

    await this.delivery.broadcastAuthorized(players, () => [
      MessageTypeS2C.PLAYER_GAME_STATE,
      undefined,
    ]);
  }
}
