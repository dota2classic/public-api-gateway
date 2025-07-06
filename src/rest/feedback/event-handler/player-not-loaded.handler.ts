import { EventBus, EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PlayerNotLoadedEvent } from "../../../gateway/events/bans/player-not-loaded.event";
import { FeedbackService } from "../../feedback/feedback.service";
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PlayerNotLoadedHandler
  implements IEventHandler<PlayerNotLoadedEvent>
{
  private logger = new Logger(PlayerNotLoadedHandler.name);
  constructor(
    private readonly ebus: EventBus,
    private readonly feedbackService: FeedbackService,
  ) {}

  async handle(event: PlayerNotLoadedEvent) {
    this.logger.log("PlayerNotLoaded event, creating feedback");
    await this.feedbackService.createFeedbackForPlayer(
      "PlayerNotLoadedEvent",
      event.playerId.value,
    );
  }
}
