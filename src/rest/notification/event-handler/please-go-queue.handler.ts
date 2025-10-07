import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PleaseGoQueueEvent } from "../event/please-go-queue.event";
import { NotificationService } from "../notification.service";

@EventsHandler(PleaseGoQueueEvent)
export class PleaseGoQueueHandler implements IEventHandler<PleaseGoQueueEvent> {
  constructor(private readonly notificationService: NotificationService) {}

  async handle(event: PleaseGoQueueEvent) {
    await this.notificationService.notifyOnliners(event.mode);
  }
}
