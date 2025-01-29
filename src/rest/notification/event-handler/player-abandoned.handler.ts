import { EventBus, EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PlayerAbandonedEvent } from "../../../gateway/events/bans/player-abandoned.event";
import { Logger } from "@nestjs/common";
import { FeedbackService } from "../../feedback/feedback.service";

@EventsHandler(PlayerAbandonedEvent)
export class PlayerAbandonedHandler
  implements IEventHandler<PlayerAbandonedEvent>
{
  private logger = new Logger(PlayerAbandonedHandler.name);

  constructor(
    private readonly ebus: EventBus,
    private readonly feedbackService: FeedbackService,
  ) {}

  async handle(event: PlayerAbandonedEvent) {
    this.logger.log("PlayerAbandonedEvent event, creating feedback");
    await this.feedbackService.createFeedbackForPlayer(
      "PlayerAbandonedEvent",
      event.playerId.value,
    );
  }
}
