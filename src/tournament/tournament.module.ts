import { Module } from "@nestjs/common";
import { TournamentController } from "./tournament.controller";
import { TournamentMapper } from "./tournament.mapper";
import { TournamentReadyCheckStartedHandler } from "../event-handler/tournament-ready-check-started.handler";
import { TournamentRegistrationInvitationCreatedHandler } from "../event-handler/tournament-registration-invitation-created.handler";
import { TournamentRegistrationInvitationResolvedHandler } from "../event-handler/tournament-registration-invitation-resolved.handler";
import { NotificationModule } from "../notification/notification.module";

@Module({
  imports: [NotificationModule],
  controllers: [TournamentController],
  providers: [
    TournamentMapper,
    TournamentReadyCheckStartedHandler,
    TournamentRegistrationInvitationCreatedHandler,
    TournamentRegistrationInvitationResolvedHandler,
  ],
})
export class TournamentModule {}
