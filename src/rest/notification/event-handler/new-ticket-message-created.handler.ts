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
import { UserProfileService } from "../../../service/user-profile.service";
import { UserReportEntity } from "../../../entity/user-report.entity";

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
    private readonly urep: UserProfileService,
    @InjectRepository(UserReportEntity)
    private readonly userReportEntityRepository: Repository<UserReportEntity>,
  ) {}

  async handle(event: MessageUpdatedEvent) {
    if (event.createdAt !== event.updatedAt) return;

    const [threadType, threadId] = event.threadId.split("_");

    if (threadType == ThreadType.TICKET) {
      await this.handleTicketMessage(event, threadId);
    } else if (threadType === ThreadType.REPORT) {
      await this.handleReportMessage(event, threadId);
    }
  }

  private async handleReportMessage(
    event: MessageUpdatedEvent,
    reportId: string,
  ) {
    const playerReport = await this.userReportEntityRepository.findOne({
      where: {
        id: reportId,
      },
    });

    if (!playerReport) {
      // No feedback?
      this.logger.warn("Received report message but no report entity", {
        messageId: event.id,
        threadId: event.threadId,
      });
      return;
    }

    if (event.author === playerReport.reporterSteamId) {
      await this.notifyNewMessage(
        event,
        `https://dotaclassic.ru/forum/report/${event.threadId.replace("report_", "")}`,
      );
      // From player
      return;
    }

    await this.notificationService.createNotification(
      playerReport.reporterSteamId,
      event.threadId,
      NotificationEntityType.REPORT_TICKET,
      NotificationType.TICKET_NEW_MESSAGE,
      "1day",
    );
  }

  private async handleTicketMessage(
    event: MessageUpdatedEvent,
    threadId: string,
  ) {
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
      await this.notifyNewMessage(
        event,
        `https://dotaclassic.ru/forum/ticket/${event.threadId.replace(/\D/g, "")}`,
      );
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

  private async notifyNewMessage(event: MessageUpdatedEvent, link: string) {
    await this.telegram.notifyFeedback(
      `Новое сообщение в обращении:\n
${await this.urep.userDto(event.author).then((it) => it.name)}: ${event.content}

${link}`,
    );
  }
}
