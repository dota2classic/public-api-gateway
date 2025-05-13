import { EventsHandler, IEventHandler, QueryBus } from "@nestjs/cqrs";
import { PartyInviteCreatedEvent } from "../../gateway/events/party/party-invite-created.event";
import { SocketDelivery } from "../socket-delivery";
import { PartyInviteReceivedMessageS2C } from "../messages/s2c/party-invite-received-message.s2c";
import { MessageTypeS2C } from "../messages/s2c/message-type.s2c";
import { UserProfileService } from "../../service/user-profile.service";

@EventsHandler(PartyInviteCreatedEvent)
export class PartyInviteCreatedHandler
  implements IEventHandler<PartyInviteCreatedEvent>
{
  constructor(
    private readonly delivery: SocketDelivery,
    private readonly queryBus: QueryBus,
    private readonly userRepository: UserProfileService,
  ) {}

  async handle(event: PartyInviteCreatedEvent) {
    const message = new PartyInviteReceivedMessageS2C(
      event.partyId,
      event.id,
      await this.userRepository.userDto(event.leaderId),
    );
    await this.delivery.deliver(
      event.invited,
      MessageTypeS2C.PARTY_INVITE_RECEIVED,
      message,
    );
  }
}
