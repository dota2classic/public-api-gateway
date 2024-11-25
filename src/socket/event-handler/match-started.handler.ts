import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { MatchStartedEvent } from "../../gateway/events/match-started.event";
import { SocketDelivery } from "../socket-delivery";
import { MessageTypeS2C } from "../messages/s2c/message-type.s2c";
import { PlayerGameStateMessageS2C } from "../messages/s2c/player-game-state-message.s2c";

@EventsHandler(MatchStartedEvent)
export class MatchStartedHandler implements IEventHandler<MatchStartedEvent> {
  constructor(private readonly delivery: SocketDelivery) {}

  async handle(event: MatchStartedEvent) {
    const players = event.info.players.map((it) => it.playerId.value);

    await new Promise((r) => setTimeout(r, 5000));

    const message = new PlayerGameStateMessageS2C(
      event.gsInfo.url,
      event.info.roomId,
      event.matchId,
    );
    await this.delivery.broadcastAuthorized(players, () => [
      MessageTypeS2C.PLAYER_GAME_STATE,
      message,
    ]);
  }
}
