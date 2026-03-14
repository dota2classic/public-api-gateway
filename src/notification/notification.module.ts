import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationService } from "./notification.service";
import { NotificationController } from "./notification.controller";
import { NotificationMapper } from "./notification.mapper";
import { TelegramNotificationService } from "./telegram-notification.service";
import { AchievementCompleteHandler } from "./event-handler/achievement-complete.handler";
import { FeedbackCreatedHandler } from "./event-handler/feedback-created.handler";
import { PlayerFeedbackCreatedHandler } from "./event-handler/player-feedback-created.handler";
import { PlayerReportBanCreatedHandler } from "./event-handler/player-report-ban-created.handler";
import { PlayerSmurfDetectedHandler } from "./event-handler/player-smurf-detected.handler";
import { PleaseGoQueueHandler } from "./event-handler/please-go-queue.handler";
import { TicketMessageHandler } from "./event-handler/ticket-message-handler.service";
import { TradeOfferExpiredHandler } from "./event-handler/trade-offer-expired.handler";
import { CreateFeedbackNotificationHandler } from "./command-handler/CreateFeebackNotification/create-feedback-notification.handler";
import { NotificationEntity } from "../database/entities/notification.entity";
import { WebpushSubscriptionEntity } from "../database/entities/webpush-subscription.entity";
import { PlayerFeedbackEntity } from "../database/entities/player-feedback.entity";
import { PlayerFlagsEntity } from "../database/entities/player-flags.entity";
import { UserReportEntity } from "../database/entities/user-report.entity";
import { FeedbackMapper } from "../feedback/feedback.mapper";
import { ConfigService } from "@nestjs/config";
import * as TelegramBot from "node-telegram-bot-api";

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationEntity, WebpushSubscriptionEntity, PlayerFeedbackEntity, PlayerFlagsEntity, UserReportEntity]),
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    NotificationMapper,
    FeedbackMapper,
    TelegramNotificationService,
    AchievementCompleteHandler,
    FeedbackCreatedHandler,
    PlayerFeedbackCreatedHandler,
    PlayerReportBanCreatedHandler,
    PlayerSmurfDetectedHandler,
    PleaseGoQueueHandler,
    TicketMessageHandler,
    TradeOfferExpiredHandler,
    CreateFeedbackNotificationHandler,
    {
      provide: "Telegram",
      useFactory(config: ConfigService) {
        return new TelegramBot(config.get("telegram.token"));
      },
      inject: [ConfigService],
    },
  ],
  exports: [
    NotificationService,
    NotificationMapper,
    TelegramNotificationService,
  ],
})
export class NotificationModule {}
