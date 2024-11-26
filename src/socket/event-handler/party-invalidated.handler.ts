import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PartyInvalidatedEvent } from "../event/party-invalidated.event";
import { SocketDelivery } from "../socket-delivery";
import { PartyService } from "../../rest/party.service";
import { MessageTypeS2C } from "../messages/s2c/message-type.s2c";

@EventsHandler(PartyInvalidatedEvent)
export class PartyInvalidatedHandler
  implements IEventHandler<PartyInvalidatedEvent>
{
  constructor(
    private readonly delivery: SocketDelivery,
    private readonly party: PartyService,
  ) {}

  async handle(event: PartyInvalidatedEvent) {
    const party = await this.party.getParty(event.steamId);
    await Promise.all(
      party.players.map((plr) =>
        this.delivery.deliver(
          plr.summary.id,
          MessageTypeS2C.PLAYER_PARTY_STATE,
          party,
        ),
      ),
    );
  }
}
