import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PlayerFeedbackThreadCreatedEvent } from "../../feedback/event/player-feedback-thread-created.event";
import {
  NotificationEntity,
  NotificationEntityType,
  NotificationType,
} from "../../../entity/notification.entity";
import { NotificationService } from "../notification.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@EventsHandler(PlayerFeedbackThreadCreatedEvent)
export class PlayerFeedbackThreadCreatedHandler
  implements IEventHandler<PlayerFeedbackThreadCreatedEvent>
{
  constructor(
    private readonly notificationService: NotificationService,
    @InjectRepository(NotificationEntity)
    private readonly notificationEntityRepository: Repository<NotificationEntity>,
  ) {}

  async handle(event: PlayerFeedbackThreadCreatedEvent) {
    await this.notificationService.createNotification(
      event.steamId,
      event.threadId,
      NotificationEntityType.FEEDBACK_TICKET,
      NotificationType.TICKET_CREATED,
      "5m",
    );
  }
}
