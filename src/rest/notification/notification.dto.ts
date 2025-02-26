import { PushSubscription } from "web-push";
import { MatchmakingMode } from "../../gateway/shared-types/matchmaking-mode";
import { ApiProperty } from "@nestjs/swagger";
import {
  NotificationEntityType,
  NotificationType,
} from "../../entity/notification.entity";

export class SubscriptionDto implements PushSubscription {
  endpoint: string;
  expirationTime: number | null;
  keys: { p256dh: string; auth: string };
}

export class TagPlayerForQueue {
  @ApiProperty({ enum: MatchmakingMode, enumName: "MatchmakingMode" })
  mode: MatchmakingMode;
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
}
