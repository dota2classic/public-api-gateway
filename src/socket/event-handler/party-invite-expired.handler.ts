import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PartyInviteExpiredEvent } from "../../gateway/events/party/party-invite-expired.event";
import { SocketDelivery } from "../socket-delivery";
import { PartyInviteExpiredMessageS2C } from "../messages/s2c/party-invite-expired-message.s2c";
import { MessageTypeS2C } from "../messages/s2c/message-type.s2c";

@EventsHandler(PartyInviteExpiredEvent)
export class PartyInviteExpiredHandler
  implements IEventHandler<PartyInviteExpiredEvent>
{
  constructor(private readonly delivery: SocketDelivery) {}

  async handle(event: PartyInviteExpiredEvent) {
    await this.delivery.deliver(
      event.invited,
      MessageTypeS2C.PARTY_INVITE_EXPIRED,
      new PartyInviteExpiredMessageS2C(event.id),
    );
  }
}
