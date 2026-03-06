import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PartyUpdatedEvent } from "../../gateway/events/party/party-updated.event";
import { SocketDelivery } from "../socket-delivery";
import { PartyService } from "../../rest/party.service";
import { MessageTypeS2C } from "../messages/s2c/message-type.s2c";
import { SocketMessageService } from "../socket-message.service";
import { PlayerQueueStateMessageS2C } from "../messages/s2c/player-queue-state-message.s2c";
import { PlayerAbandonedEvent } from "../../gateway/events/bans/player-abandoned.event";

@EventsHandler(PlayerAbandonedEvent)
export class PlayerAbandonedSocketHandler implements IEventHandler<PlayerAbandonedEvent> {
  constructor(
    private readonly delivery: SocketDelivery,
    private readonly partyService: PartyService,
    private readonly socketMessage: SocketMessageService,
  ) {}

  async handle(event: PlayerAbandonedEvent) {
    const gs = await this.socketMessage.playerGameState(event.playerId.value)
    await this.delivery.deliver(event.playerId.value, MessageTypeS2C.PLAYER_GAME_STATE, gs)
  }
}
