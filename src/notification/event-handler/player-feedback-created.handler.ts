import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { NotificationService } from "../notification.service";
import {
  NotificationEntityType,
  NotificationType,
} from "../../entity/notification.entity";
import { PlayerFeedbackCreatedCommand } from "./player-feedback-created.command";

@CommandHandler(PlayerFeedbackCreatedCommand)
export class PlayerFeedbackCreatedHandler
  implements ICommandHandler<PlayerFeedbackCreatedCommand>
{
  constructor(private readonly notification: NotificationService) {}

  async execute({ event }: PlayerFeedbackCreatedCommand) {
    await this.notification.createNotification(
      event.receiverSteamId,
      event.matchId.toString(),
      NotificationEntityType.MATCH,
      NotificationType.PLAYER_FEEDBACK,
      "5m",
    );
  }
}
