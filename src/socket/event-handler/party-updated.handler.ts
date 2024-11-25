import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PartyUpdatedEvent } from "../../gateway/events/party/party-updated.event";
import { SocketDelivery } from "../socket-delivery";
import { PartyService } from "../../rest/party.service";
import { MessageTypeS2C } from "../messages/s2c/message-type.s2c";

@EventsHandler(PartyUpdatedEvent)
export class PartyUpdatedHandler implements IEventHandler<PartyUpdatedEvent> {
  constructor(
    private readonly delivery: SocketDelivery,
    private readonly partyService: PartyService,
  ) {}

  async handle(event: PartyUpdatedEvent) {
    // TODO: can we do it? is it safe? or should ve map it per user?
    const partyDto = await this.partyService.getParty(event.leaderId.value);

    await this.delivery.broadcastAuthorized(
      event.players.map((it) => it.value),
      () => [MessageTypeS2C.PLAYER_PARTY_STATE, partyDto],
    );
  }
}
