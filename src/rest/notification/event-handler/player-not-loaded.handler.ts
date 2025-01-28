import { EventBus, EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PlayerNotLoadedEvent } from "../../../gateway/events/bans/player-not-loaded.event";
import { FeedbackService } from "../../feedback/feedback.service";

@EventsHandler(PlayerNotLoadedEvent)
export class PlayerNotLoadedHandler
  implements IEventHandler<PlayerNotLoadedEvent>
{
  constructor(
    private readonly ebus: EventBus,
    private readonly feedbackService: FeedbackService,
  ) {}

  async handle(event: PlayerNotLoadedEvent) {
    await this.feedbackService.createFeedbackForPlayer(
      "PlayerNotLoadedEvent",
      event.playerId.value,
    );
  }
}
