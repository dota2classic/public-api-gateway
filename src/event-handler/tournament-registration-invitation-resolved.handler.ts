import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { TournamentRegistrationInvitationResolvedEvent } from "../gateway/events/tournament/tournament-registration-invitation-resolved.event";
import {
  NotificationEntityType,
  NotificationType,
} from "../entity/notification.entity";
import { NotificationService } from "../rest/notification/notification.service";

@EventsHandler(TournamentRegistrationInvitationResolvedEvent)
export class TournamentRegistrationInvitationResolvedHandler
  implements IEventHandler<TournamentRegistrationInvitationResolvedEvent>
{
  constructor(private readonly notificationService: NotificationService) {}

  async handle(event: TournamentRegistrationInvitationResolvedEvent) {
    await this.notificationService.createNotification(
      event.steamId,
      event.inviterSteamId,
      NotificationEntityType.PLAYER,
      NotificationType.TOURNAMENT_REGISTRATION_INVITATION_RESOLVED,
      "30 days",
      {
        steamId: event.steamId,
        accept: event.accept,
      },
    );
  }
}
