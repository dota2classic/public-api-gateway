import { EventBus, EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { FeedbackCreatedEvent } from "../../feedback/event/feedback-created.event";
import { NotificationService } from "../notification.service";
import {
  NotificationEntity,
  NotificationEntityType,
  NotificationType,
} from "../../../entity/notification.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { NotificationMapper } from "../notification.mapper";

@EventsHandler(FeedbackCreatedEvent)
export class FeedbackCreatedHandler
  implements IEventHandler<FeedbackCreatedEvent>
{
  constructor(
    private readonly notificationService: NotificationService,
    @InjectRepository(NotificationEntity)
    private readonly notificationEntityRepository: Repository<NotificationEntity>,
    private readonly ebus: EventBus,
    private readonly mapper: NotificationMapper,
  ) {}

  async handle(event: FeedbackCreatedEvent) {
    await this.notificationService.createNotification(
      event.steamId,
      event.playerFeedbackId.toString(),
      NotificationEntityType.FEEDBACK,
      NotificationType.FEEDBACK_CREATED,
      "10m",
    );
  }
}
