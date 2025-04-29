import { Injectable } from "@nestjs/common";
import {
  NotificationEntity,
  NotificationEntityType,
} from "../../entity/notification.entity";
import { NotificationDto } from "./notification.dto";
import { FeedbackMapper } from "../feedback/feedback.mapper";

@Injectable()
export class NotificationMapper {
  constructor(private readonly feedbackMapper: FeedbackMapper) {}

  public mapNotification = (
    notification: NotificationEntity,
  ): NotificationDto => {
    let title: string = "Уведомление";
    let content: string = "Содержание";

    if (notification.feedback) {
      title = notification.feedback.title;
      content = "Расскажи, что пошло не по плану";
    } else if (notification.entityType == NotificationEntityType.ACHIEVEMENT) {
    }

    return {
      id: notification.id,
      acknowledged: notification.acknowledged,
      createdAt: notification.createdAt.toISOString(),
      expiresAt: notification.expiresAt.toISOString(),
      steamId: notification.steamId,
      // feedback
      entityId: notification.entityId,
      entityType: notification.entityType,
      notificationType: notification.notificationType,
      title,
      content,
    };
  };
}
