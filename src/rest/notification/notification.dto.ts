import { PushSubscription } from "web-push";
import { MatchmakingMode } from "../../gateway/shared-types/matchmaking-mode";
import { ApiProperty } from "@nestjs/swagger";

export class SubscriptionDto implements PushSubscription {
  endpoint: string;
  expirationTime: number | null;
  keys: { p256dh: string; auth: string };
}

export class TagPlayerForQueue {
  @ApiProperty({ enum: MatchmakingMode, enumName: "MatchmakingMode" })
  mode: MatchmakingMode;
}
