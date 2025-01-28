import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { NotificationCreatedEvent } from "../../rest/notification/event/notification-created.event";
import { SocketDelivery } from "../socket-delivery";
import { MessageTypeS2C } from "../messages/s2c/message-type.s2c";
import { NotificationCreatedMessageS2C } from "../messages/s2c/notification-created-message.s2c";

@EventsHandler(NotificationCreatedEvent)
export class NotificationCreatedHandler
  implements IEventHandler<NotificationCreatedEvent>
{
  constructor(private readonly delivery: SocketDelivery) {}

  async handle(event: NotificationCreatedEvent) {
    await this.delivery.deliver(
      event.notification.steamId,
      MessageTypeS2C.NOTIFICATION_CREATED,
      new NotificationCreatedMessageS2C(event.notification),
    );
  }
}
