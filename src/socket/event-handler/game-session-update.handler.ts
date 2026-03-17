import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { SocketDelivery } from "../socket-delivery";
import { MessageTypeS2C } from "../messages/s2c/message-type.s2c";
import { SocketMessageService } from "../socket-message.service";
import { Logger } from "@nestjs/common";
import { GameSessionUpdateEvent } from "gateway/events/gs/game-session-update.event";

@EventsHandler(GameSessionUpdateEvent)
export class GameSessionUpdateHandler
  implements IEventHandler<GameSessionUpdateEvent>
{
  private logger = new Logger(GameSessionUpdateHandler.name);
  constructor(
    private readonly delivery: SocketDelivery,
    private readonly socketMessage: SocketMessageService,
  ) {}

  async handle(event: GameSessionUpdateEvent) {
    const gs = await this.socketMessage.playerGameState(event.steamId);
    this.logger.log(
      "Received GameSessionUpdateEvent for " +
        event.steamId +
        ", emitting its gamestate: ",
      gs,
    );

    await this.delivery.deliver(
      event.steamId,
      MessageTypeS2C.PLAYER_GAME_STATE,
      gs,
    );
  }
}
