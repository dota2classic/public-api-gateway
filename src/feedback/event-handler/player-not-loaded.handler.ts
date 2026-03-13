import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { FeedbackService } from "../../feedback/feedback.service";
import { Injectable, Logger } from "@nestjs/common";
import { PlayerNotLoadedCommand } from "./player-not-loaded.command";

@Injectable()
@CommandHandler(PlayerNotLoadedCommand)
export class PlayerNotLoadedHandler
  implements ICommandHandler<PlayerNotLoadedCommand>
{
  private logger = new Logger(PlayerNotLoadedHandler.name);
  constructor(private readonly feedbackService: FeedbackService) {}

  async execute({ event }: PlayerNotLoadedCommand) {
    this.logger.log("PlayerNotLoaded event, creating feedback");
    await this.feedbackService.createFeedbackForPlayer(
      "PlayerNotLoadedEvent",
      event.playerId.value,
    );
  }
}
