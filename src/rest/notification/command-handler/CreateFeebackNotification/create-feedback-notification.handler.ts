import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Logger } from "@nestjs/common";
import { CreateFeedbackNotificationCommand } from "./create-feedback-notification.command";
import { NotificationService } from "../../notification.service";
import {
  NotificationEntityType,
  NotificationType,
} from "../../../../entity/notification.entity";

@CommandHandler(CreateFeedbackNotificationCommand)
export class CreateFeedbackNotificationHandler
  implements ICommandHandler<CreateFeedbackNotificationCommand>
{
  private readonly logger = new Logger(CreateFeedbackNotificationHandler.name);

  constructor(private readonly notification: NotificationService) {}

  async execute(command: CreateFeedbackNotificationCommand) {
    await this.notification.createNotification(
      command.receiverSteamId,
      command.matchId.toString(),
      NotificationEntityType.MATCH,
      NotificationType.PLAYER_FEEDBACK,
      "5m",
    );
  }
}
