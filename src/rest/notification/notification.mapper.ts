import { Injectable } from "@nestjs/common";
import {
  NotificationEntity,
  NotificationEntityType,
} from "../../entity/notification.entity";
import {
  NotificationAchievementDto,
  NotificationDto,
  NotificationMatchDto,
  NotificationThreadDto,
} from "./notification.dto";
import { FeedbackMapper } from "../feedback/feedback.mapper";
import { PlayerFeedbackEntity } from "../../entity/player-feedback.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { PlayerFeedbackDto } from "../feedback/feedback.dto";
import { AchievementKey } from "../../gateway/shared-types/achievemen-key";
import { ThreadType } from "../../gateway/shared-types/thread-type";

@Injectable()
export class NotificationMapper {
  constructor(
    private readonly feedbackMapper: FeedbackMapper,
    @InjectRepository(PlayerFeedbackEntity)
    private readonly playerFeedbackEntityRepository: Repository<PlayerFeedbackEntity>,
  ) {}

  public mapNotification = async (
    notification: NotificationEntity,
  ): Promise<NotificationDto> => {
    let title: string = "Уведомление";
    let content: string = "Содержание";

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
      params: notification.params,
      feedback: await this.mapPlayerFeedback(notification),
      achievement: await this.mapAchievement(notification),
      thread: await this.mapThread(notification),
      match: await this.mapMatch(notification),
    };
  };

  private async mapPlayerFeedback(
    notification: NotificationEntity,
  ): Promise<PlayerFeedbackDto | undefined> {
    if (notification.entityType !== NotificationEntityType.FEEDBACK)
      return undefined;
    return this.playerFeedbackEntityRepository
      .findOne({
        where: {
          id: Number(notification.entityId),
        },
      })
      .then(this.feedbackMapper.mapPlayerFeedback);
  }

  private async mapAchievement(
    notification: NotificationEntity,
  ): Promise<NotificationAchievementDto | undefined> {
    if (notification.entityType !== NotificationEntityType.ACHIEVEMENT)
      return undefined;
    return {
      key: notification.entityId as unknown as AchievementKey,
    };
  }

  private async mapThread(
    notification: NotificationEntity,
  ): Promise<NotificationThreadDto | undefined> {
    if (
      notification.entityType !== NotificationEntityType.FEEDBACK_TICKET &&
      notification.entityType !== NotificationEntityType.REPORT_TICKET
    )
      return undefined;
    return {
      externalId: notification.entityId,
      threadType:
        notification.entityType === NotificationEntityType.REPORT_TICKET
          ? ThreadType.REPORT
          : ThreadType.TICKET,
    };
  }

  private async mapMatch(
    notification: NotificationEntity,
  ): Promise<NotificationMatchDto | undefined> {
    if (notification.entityType !== NotificationEntityType.MATCH)
      return undefined;
    return {
      id: Number(notification.entityId),
    };
  }
}
