import { EventBus, EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { AchievementCompleteEvent } from "../../../gateway/events/gs/achievement-complete.event";
import {
  NotificationEntity,
  NotificationEntityType,
} from "../../../entity/notification.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { NotificationService } from "../notification.service";
import { Repository } from "typeorm";
import { NotificationMapper } from "../notification.mapper";
import { NotificationCreatedEvent } from "../event/notification-created.event";

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
    let ne = new NotificationEntity(
      event.playerId,
      event.achievement,
      NotificationEntityType.ACHIEVEMENT,
      "1m",
    );
    ne = await this.notificationEntityRepository.save(ne);
    ne = await this.notificationService.getFullNotification(ne.id);
    this.ebus.publish(
      new NotificationCreatedEvent(this.mapper.mapNotification(ne)),
    );
  }
}
