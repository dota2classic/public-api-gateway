import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { AchievementCompleteEvent } from "../../gateway/events/gs/achievement-complete.event";
import {
  NotificationEntityType,
  NotificationType,
} from "../../database/entities/notification.entity";
import { NotificationService } from "../notification.service";

@EventsHandler(AchievementCompleteEvent)
export class AchievementCompleteHandler
  implements IEventHandler<AchievementCompleteEvent>
{
  constructor(private readonly notificationService: NotificationService) {}

  async handle(event: AchievementCompleteEvent) {
    await this.notificationService.createNotification(
      event.playerId,
      event.achievement.toString(),
      NotificationEntityType.ACHIEVEMENT,
      NotificationType.ACHIEVEMENT_COMPLETE,
      "1m",
      {
        checkpoints: event.checkpoints,
        progress: event.progress,
        achievement_key: event.achievement,
      },
    );
  }
}
