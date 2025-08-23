import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PlayerFinishedMatchEvent } from "../../../gateway/events/gs/player-finished-match.event";
import { Logger } from "@nestjs/common";
import { FeedbackService } from "../../feedback/feedback.service";

@EventsHandler(PlayerFinishedMatchEvent)
export class PlayerFinishedMatchHandler
  implements IEventHandler<PlayerFinishedMatchEvent>
{
  private logger = new Logger(PlayerFinishedMatchHandler.name);

  private GAME_FEEDBACK_CHANCE = 0.2;

  constructor(private readonly feedbackService: FeedbackService) {}

  async handle(event: PlayerFinishedMatchEvent) {
    if (event.isFirstGame || Math.random() < this.GAME_FEEDBACK_CHANCE) {
      // create feedback
      this.logger.log("PlayerFinishedMatchEvent event, creating feedback");
      await this.feedbackService.createFeedbackForPlayer(
        "PlayerFinishedMatchEvent",
        event.steamId,
      );
    }
  }
}
