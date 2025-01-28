import { EventBus, EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { FeedbackCreatedEvent } from "../../feedback/event/feedback-created.event";
import { NotificationService } from "../notification.service";
import { NotificationEntity } from "../../../entity/notification.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { NotificationCreatedEvent } from "../event/notification-created.event";
import { NotificationMapper } from "../notification.mapper";

@EventsHandler(FeedbackCreatedEvent)
export class FeedbackCreatedHandler
  implements IEventHandler<FeedbackCreatedEvent>
{
  constructor(
    private readonly notificationService: NotificationService,
    @InjectRepository(NotificationEntity)
    private readonly notificationEntityRepository: Repository<NotificationEntity>,
    private readonly ebus: EventBus,
    private readonly mapper: NotificationMapper,
  ) {}

  async handle(event: FeedbackCreatedEvent) {
    let ne = new NotificationEntity(event.steamId);
    ne.playerFeedbackId = event.playerFeedbackId;
    ne = await this.notificationEntityRepository.save(ne);
    ne = await this.notificationEntityRepository.findOne({
      where: {
        id: ne.id,
      },
    });
    this.ebus.publish(
      new NotificationCreatedEvent(this.mapper.mapNotification(ne)),
    );
  }
}
