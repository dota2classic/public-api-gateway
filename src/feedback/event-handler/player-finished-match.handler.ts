import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Logger } from "@nestjs/common";
import { FeedbackService } from "../feedback.service";
import { PlayerFinishedMatchCommand } from "./player-finished-match.command";

@CommandHandler(PlayerFinishedMatchCommand)
export class PlayerFinishedMatchHandler
  implements ICommandHandler<PlayerFinishedMatchCommand>
{
  private logger = new Logger(PlayerFinishedMatchHandler.name);
  private GAME_FEEDBACK_CHANCE = 0.2;

  constructor(private readonly feedbackService: FeedbackService) {}

  async execute({ event }: PlayerFinishedMatchCommand) {
    if (event.isFirstGame || Math.random() < this.GAME_FEEDBACK_CHANCE) {
      this.logger.log("PlayerFinishedMatchEvent event, creating feedback");
      await this.feedbackService.createFeedbackForPlayer(
        "PlayerFinishedMatchEvent",
        event.steamId,
      );
    }
  }
}
