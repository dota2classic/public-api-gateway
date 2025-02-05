import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { MessageUpdatedEvent } from "../../../gateway/events/message-updated.event";
import {
  NotificationEntityType,
  NotificationType,
} from "../../../entity/notification.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PlayerFeedbackEntity } from "../../../entity/player-feedback.entity";
import { ThreadType } from "../../../gateway/shared-types/thread-type";
import { Logger } from "@nestjs/common";
import { NotificationService } from "../../notification/notification.service";
import { TelegramNotificationService } from "../telegram-notification.service";
import { UserRepository } from "../../../cache/user/user.repository";

@EventsHandler(MessageUpdatedEvent)
export class NewTicketMessageCreatedHandler
  implements IEventHandler<MessageUpdatedEvent>
{
  private logger = new Logger(NewTicketMessageCreatedHandler.name);
  constructor(
    private readonly notificationService: NotificationService,
    @InjectRepository(PlayerFeedbackEntity)
    private readonly playerFeedbackEntityRepository: Repository<PlayerFeedbackEntity>,
    private readonly telegram: TelegramNotificationService,
    private readonly urep: UserRepository,
  ) {}

  async handle(event: MessageUpdatedEvent) {
    if (event.createdAt !== event.updatedAt) return;

    const [threadType, threadId] = event.threadId.split("_");

    if (threadType !== ThreadType.TICKET) return;

    const playerFeedbackId = Number(threadId);
    const pFeedback = await this.playerFeedbackEntityRepository.findOne({
      where: {
        id: playerFeedbackId,
      },
    });

    if (!pFeedback) {
      // No feedback?
      this.logger.warn("Received ticket message but no feedback", {
        messageId: event.id,
        threadId: event.threadId,
      });
      return;
    }

    if (event.author === pFeedback.steamId) {
      await this.notifyNewMessage(event);
      // From player
      return;
    }

    await this.notificationService.createNotification(
      pFeedback.steamId,
      event.threadId,
      NotificationEntityType.FEEDBACK_TICKET,
      NotificationType.TICKET_NEW_MESSAGE,
      "1day",
    );
  }

  private async notifyNewMessage(event: MessageUpdatedEvent) {
    await this.telegram.notifyFeedback(
      `Новое сообщение в обращении:\n
${await this.urep.name(event.author)}: ${event.content}
https://dotaclassic.ru/forum/ticket/${event.threadId.replace(/\D/g, "")}`,
    );
  }
}
