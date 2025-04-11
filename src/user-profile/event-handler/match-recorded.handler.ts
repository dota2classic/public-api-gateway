import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { UserProfileService } from "../service/user-profile.service";
import { MatchRecordedEvent } from "../../gateway/events/gs/match-recorded.event";

@EventsHandler(MatchRecordedEvent)
export class MatchRecordedHandler implements IEventHandler<MatchRecordedEvent> {
  constructor(private readonly userProfile: UserProfileService) {}

  async handle(event: MatchRecordedEvent) {
    await Promise.all(
      event.players.map((player) =>
        this.userProfile.updateSummary(player.steam_id),
      ),
    );
  }
}
