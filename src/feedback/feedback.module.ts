import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FeedbackEntity } from "../database/entities/feedback.entity";
import { PlayerFeedbackEntity } from "../database/entities/player-feedback.entity";
import { PlayerFeedbackOptionResultEntity } from "../database/entities/player-feedback-option-result.entity";
import { FeedbackOptionEntity } from "../database/entities/feedback-option.entity";
import { FeedbackService } from "./feedback.service";
import { AiService } from "../service/ai.service";
import { FeedbackMapper } from "./feedback.mapper";
import { FeedbackController } from "./feedback.controller";
import { AdminFeedbackController } from "./admin-feedback.controller";
import { PlayerNotLoadedHandler } from "./event-handler/player-not-loaded.handler";
import { PlayerAbandonedHandler } from "./event-handler/player-abandoned.handler";
import { PlayerFinishedMatchHandler } from "./event-handler/player-finished-match.handler";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FeedbackEntity,
      PlayerFeedbackEntity,
      PlayerFeedbackOptionResultEntity,
      FeedbackOptionEntity,
    ]),
  ],
  controllers: [FeedbackController, AdminFeedbackController],
  providers: [
    FeedbackService,
    AiService,
    FeedbackMapper,
    PlayerNotLoadedHandler,
    PlayerAbandonedHandler,
    PlayerFinishedMatchHandler,
  ],
  exports: [FeedbackService, AiService],
})
export class FeedbackModule {}
