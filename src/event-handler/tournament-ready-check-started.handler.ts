import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { TournamentReadyCheckStartedEvent } from "../gateway/events/tournament/tournament-ready-check-started.event";
import { NotificationService } from "../rest/notification/notification.service";
import {
  NotificationEntityType,
  NotificationType,
} from "../entity/notification.entity";

@EventsHandler(TournamentReadyCheckStartedEvent)
export class TournamentReadyCheckStartedHandler
  implements IEventHandler<TournamentReadyCheckStartedEvent>
{
  constructor(private readonly notification: NotificationService) {}

  async handle(event: TournamentReadyCheckStartedEvent) {
    // Need create notification
    await this.notification.createNotification(
      event.steamId,
      event.steamId,
      NotificationEntityType.PLAYER,
      NotificationType.TOURNAMENT_READY_CHECK_STARTED,
      "1 hour",
      {
        tournamentId: event.tournamentId
      }
    );
  }
}
