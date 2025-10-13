import { PushSubscription } from "web-push";
import { MatchmakingMode } from "../../gateway/shared-types/matchmaking-mode";
import { ApiProperty } from "@nestjs/swagger";
import {
  NotificationEntityType,
  NotificationType,
} from "../../entity/notification.entity";
import { PlayerFeedbackDto } from "../feedback/feedback.dto";
import { AchievementKey } from "../../gateway/shared-types/achievemen-key";
import { ThreadType } from "../../gateway/shared-types/thread-type";

export class SubscriptionDto implements PushSubscription {
  endpoint: string;
  expirationTime: number | null;
  keys: { p256dh: string; auth: string };
}

export class TagPlayerForQueue {
  @ApiProperty({ enum: MatchmakingMode, enumName: "MatchmakingMode" })
  mode: MatchmakingMode;
}

export class NotificationAchievementDto {
  @ApiProperty({ enum: AchievementKey, enumName: "AchievementKey" })
  key: AchievementKey;
}

export class NotificationThreadDto {
  readonly externalId: string;
  @ApiProperty({ enum: ThreadType, enumName: "ThreadType" })
  readonly threadType: ThreadType;
}

export class NotificationMatchDto {
  id: number;
}

export class NotificationDto {
  id: string;
  acknowledged: boolean;
  createdAt: string;
  expiresAt: string;
  steamId: string;

  entityType: NotificationEntityType;
  entityId: string;

  @ApiProperty({ enum: NotificationType, enumName: "NotificationType" })
  notificationType: NotificationType;

  title: string;
  content: string;

  params: Record<string, unknown>;

  feedback?: PlayerFeedbackDto;
  achievement?: NotificationAchievementDto;
  thread?: NotificationThreadDto;
  match?: NotificationMatchDto;
}
