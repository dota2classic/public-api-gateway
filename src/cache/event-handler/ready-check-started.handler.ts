import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ReadyCheckStartedEvent } from "../../gateway/events/ready-check-started.event";
import { NotificationService } from "../../rest/notification/notification.service";

@EventsHandler(ReadyCheckStartedEvent)
export class ReadyCheckStartedHandler
  implements IEventHandler<ReadyCheckStartedEvent>
{
  constructor(private readonly notificationService: NotificationService) {}

  async handle(event: ReadyCheckStartedEvent) {
    const [payload, subs] =
      await this.notificationService.createGameAcceptPayload(event);
    await this.notificationService.notify(payload, subs);
  }
}
