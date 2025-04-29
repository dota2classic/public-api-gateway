import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PlayerReportBanCreatedEvent } from "../../../gateway/events/bans/player-report-ban-created.event";
import { NotificationService } from "../notification.service";
import {
  NotificationEntityType,
  NotificationType,
} from "../../../entity/notification.entity";

@EventsHandler(PlayerReportBanCreatedEvent)
export class PlayerReportBanCreatedHandler
  implements IEventHandler<PlayerReportBanCreatedEvent>
{
  constructor(private readonly notification: NotificationService) {}

  async handle(event: PlayerReportBanCreatedEvent) {
    await this.notification.createNotification(
      event.steamId,
      event.steamId,
      NotificationEntityType.PLAYER,
      NotificationType.PLAYER_REPORT_BAN,
      "7d",
    );
  }
}
