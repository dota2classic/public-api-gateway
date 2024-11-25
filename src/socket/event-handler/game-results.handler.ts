import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { GameResultsEvent } from "../../gateway/events/gs/game-results.event";
import { MessageTypeS2C } from "../messages/s2c/message-type.s2c";
import { SocketDelivery } from "../socket-delivery";

@EventsHandler(GameResultsEvent)
export class GameResultsHandler implements IEventHandler<GameResultsEvent> {
  constructor(private readonly delivery: SocketDelivery) {}

  async handle(event: GameResultsEvent) {
    const players = event.players.map((it) => it.steam_id);

    await this.delivery.broadcastAuthorized(players, () => [
      MessageTypeS2C.PLAYER_GAME_STATE,
      undefined,
    ]);
  }
}
