import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { MatchFinishedEvent } from "../../gateway/events/match-finished.event";
import { UserProfileService } from "../service/user-profile.service";

@EventsHandler(MatchFinishedEvent)
export class MatchFinishedHandler implements IEventHandler<MatchFinishedEvent> {
  constructor(private readonly userProfile: UserProfileService) {}

  async handle(event: MatchFinishedEvent) {
    await Promise.all(
      event.info.players.map((player) =>
        this.userProfile.updateSummary(player.playerId.value),
      ),
    );
  }
}
