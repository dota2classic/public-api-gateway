import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { NotificationService } from "../notification.service";
import {
  NotificationEntity,
  NotificationEntityType,
  NotificationType,
} from "../../entity/notification.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FeedbackCreatedCommand } from "./feedback-created.command";

@CommandHandler(FeedbackCreatedCommand)
export class FeedbackCreatedHandler
  implements ICommandHandler<FeedbackCreatedCommand>
{
  constructor(
    private readonly notificationService: NotificationService,
    @InjectRepository(NotificationEntity)
    private readonly notificationEntityRepository: Repository<NotificationEntity>,
  ) {}

  async execute({ event }: FeedbackCreatedCommand) {
    await this.notificationService.createNotification(
      event.steamId,
      event.playerFeedbackId.toString(),
      NotificationEntityType.FEEDBACK,
      NotificationType.FEEDBACK_CREATED,
      "3m",
    );
  }
}
