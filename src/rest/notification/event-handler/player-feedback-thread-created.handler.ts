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
import { TelegramNotificationService } from "../telegram-notification.service";
import { UserRepository } from "../../../cache/user/user.repository";

@EventsHandler(PlayerFeedbackThreadCreatedEvent)
export class PlayerFeedbackThreadCreatedHandler
  implements IEventHandler<PlayerFeedbackThreadCreatedEvent>
{
  constructor(
    private readonly notificationService: NotificationService,
    @InjectRepository(NotificationEntity)
    private readonly notificationEntityRepository: Repository<NotificationEntity>,
    private readonly telegram: TelegramNotificationService,
    private readonly urep: UserRepository,
  ) {}

  async handle(event: PlayerFeedbackThreadCreatedEvent) {
    await this.notificationService.createNotification(
      event.steamId,
      event.threadId,
      NotificationEntityType.FEEDBACK_TICKET,
      NotificationType.TICKET_CREATED,
      "5m",
    );
    await this.createTelegramNotification(event);
  }

  private async createTelegramNotification(
    event: PlayerFeedbackThreadCreatedEvent,
  ) {
    await this.telegram.notifyFeedback(
      `Новое обращение от пользователя ${await this.urep.name(event.steamId)}
${event.title}
https://dotaclassic.ru/forum/ticket/${event.threadId.replace(/\D/g, "")}`,
    );
  }
}
