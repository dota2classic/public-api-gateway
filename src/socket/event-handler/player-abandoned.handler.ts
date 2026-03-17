import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { SocketDelivery } from "../socket-delivery";
import { PartyService } from "../../party.service";
import { MessageTypeS2C } from "../messages/s2c/message-type.s2c";
import { SocketMessageService } from "../socket-message.service";
import { PlayerAbandonedEvent } from "../../gateway/events/bans/player-abandoned.event";
import { Logger } from "@nestjs/common";

@EventsHandler(PlayerAbandonedEvent)
export class PlayerAbandonedSocketHandler
  implements IEventHandler<PlayerAbandonedEvent>
{
  private logger = new Logger(PlayerAbandonedSocketHandler.name);
  constructor(
    private readonly delivery: SocketDelivery,
    private readonly partyService: PartyService,
    private readonly socketMessage: SocketMessageService,
  ) {}

  async handle(event: PlayerAbandonedEvent) {
    const gs = await this.socketMessage.playerGameState(event.playerId.value);
    this.logger.log(
      "Received PlayerAbandonedEvent for " +
        event.playerId.value +
        ", emitting its gamestate: ",
      gs,
    );

    await this.delivery.deliver(
      event.playerId.value,
      MessageTypeS2C.PLAYER_GAME_STATE,
      gs,
    );
  }
}
