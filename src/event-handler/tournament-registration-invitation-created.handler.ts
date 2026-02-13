import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { TournamentRegistrationInvitationCreatedEvent } from "../gateway/events/tournament/tournament-registration-invitation-created.event";
import { NotificationService } from "../rest/notification/notification.service";
import {
  NotificationEntityType,
  NotificationType,
} from "../entity/notification.entity";

@EventsHandler(TournamentRegistrationInvitationCreatedEvent)
export class TournamentRegistrationInvitationCreatedHandler
  implements IEventHandler<TournamentRegistrationInvitationCreatedEvent>
{
  constructor(private readonly notificationService: NotificationService) {}

  async handle(event: TournamentRegistrationInvitationCreatedEvent) {
    // Invitation is created! Create a long living notification
    await this.notificationService.createNotification(
      event.steamId,
      event.inviterSteamId,
      NotificationEntityType.PLAYER,
      NotificationType.TOURNAMENT_REGISTRATION_INVITATION_CREATED,
      "30 days",
      {
        invitationId: event.invitationId,
        tournamentId: event.tournamentId,
      },
    );
  }
}
