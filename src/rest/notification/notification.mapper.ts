import { Injectable } from "@nestjs/common";
import { NotificationEntity } from "../../entity/notification.entity";
import { NotificationDto } from "./notification.dto";
import { FeedbackMapper } from "../feedback/feedback.mapper";

@Injectable()
export class NotificationMapper {
  constructor(private readonly feedbackMapper: FeedbackMapper) {}

  public mapNotification = (
    notification: NotificationEntity,
  ): NotificationDto => {
    const feedback =
      notification.feedback &&
      this.feedbackMapper.mapFeedback(notification.feedback);

    return {
      id: notification.id,
      acknowledged: notification.acknowledged,
      createdAt: notification.createdAt.toISOString(),
      steamId: notification.steamId,
      feedback,
    };
  };
}
