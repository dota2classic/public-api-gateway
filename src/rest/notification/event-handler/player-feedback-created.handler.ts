import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PlayerFeedbackCreatedEvent } from "../../../gateway/events/player-feedback-created.event";
import { NotificationService } from "../notification.service";
import {
  NotificationEntityType,
  NotificationType,
} from "../../../entity/notification.entity";

@EventsHandler(PlayerFeedbackCreatedEvent)
export class PlayerFeedbackCreatedHandler
  implements IEventHandler<PlayerFeedbackCreatedEvent>
{
  constructor(private readonly notification: NotificationService) {}

  async handle(event: PlayerFeedbackCreatedEvent) {
    await this.notification.createNotification(
      event.receiverSteamId,
      event.matchId.toString(),
      NotificationEntityType.MATCH,
      NotificationType.PLAYER_FEEDBACK,
      "5m",
    );
  }
}
