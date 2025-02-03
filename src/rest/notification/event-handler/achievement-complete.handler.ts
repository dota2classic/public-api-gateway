import { EventBus, EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { AchievementCompleteEvent } from "../../../gateway/events/gs/achievement-complete.event";
import {
  NotificationEntity,
  NotificationEntityType,
  NotificationType,
} from "../../../entity/notification.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { NotificationService } from "../notification.service";
import { Repository } from "typeorm";
import { NotificationMapper } from "../notification.mapper";

@EventsHandler(AchievementCompleteEvent)
export class AchievementCompleteHandler
  implements IEventHandler<AchievementCompleteEvent>
{
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationEntityRepository: Repository<NotificationEntity>,
    private readonly notificationService: NotificationService,
    private readonly ebus: EventBus,
    private readonly mapper: NotificationMapper,
  ) {}

  async handle(event: AchievementCompleteEvent) {
    await this.notificationService.createNotification(
      event.playerId,
      event.achievement.toString(),
      NotificationEntityType.ACHIEVEMENT,
      NotificationType.ACHIEVEMENT_COMPLETE,
      "1m",
    );
  }
}
