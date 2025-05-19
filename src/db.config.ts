import { WebpushSubscriptionEntity } from "./entity/webpush-subscription.entity";
import { LobbyEntity } from "./entity/lobby.entity";
import { LobbySlotEntity } from "./entity/lobby-slot.entity";
import { PlayerFeedbackOptionResultEntity } from "./entity/player-feedback-option-result.entity";
import { FeedbackOptionEntity } from "./entity/feedback-option.entity";
import { FeedbackEntity } from "./entity/feedback.entity";
import { PlayerFeedbackEntity } from "./entity/player-feedback.entity";
import { NotificationEntity } from "./entity/notification.entity";
import { BlogpostEntity } from "./entity/blogpost.entity";
import { PlayerFlagsEntity } from "./entity/player-flags.entity";
import { UserProfileDecorationEntity } from "./entity/user-profile-decoration.entity";
import { UserProfileDecorationPreferencesEntity } from "./entity/user-profile-decoration-preferences.entity";
import { UserPaymentEntity } from "./entity/user-payment.entity";
import { SubscriptionProductEntity } from "./entity/subscription-product.entity";

export const Entities = [
  WebpushSubscriptionEntity,
  LobbyEntity,
  LobbySlotEntity,
  PlayerFeedbackOptionResultEntity,
  PlayerFeedbackEntity,
  FeedbackOptionEntity,
  FeedbackEntity,
  NotificationEntity,
  BlogpostEntity,
  PlayerFlagsEntity,
  UserProfileDecorationEntity,
  UserProfileDecorationPreferencesEntity,
  UserPaymentEntity,
  SubscriptionProductEntity,
];
