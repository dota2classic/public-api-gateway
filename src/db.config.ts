import { WebpushSubscriptionEntity } from "./database/entities/webpush-subscription.entity";
import { LobbyEntity } from "./database/entities/lobby.entity";
import { LobbySlotEntity } from "./database/entities/lobby-slot.entity";
import { PlayerFeedbackOptionResultEntity } from "./database/entities/player-feedback-option-result.entity";
import { FeedbackOptionEntity } from "./database/entities/feedback-option.entity";
import { FeedbackEntity } from "./database/entities/feedback.entity";
import { PlayerFeedbackEntity } from "./database/entities/player-feedback.entity";
import { NotificationEntity } from "./database/entities/notification.entity";
import { BlogpostEntity } from "./database/entities/blogpost.entity";
import { PlayerFlagsEntity } from "./database/entities/player-flags.entity";
import { UserProfileDecorationEntity } from "./database/entities/user-profile-decoration.entity";
import { UserProfileDecorationPreferencesEntity } from "./database/entities/user-profile-decoration-preferences.entity";
import { UserPaymentEntity } from "./database/entities/user-payment.entity";
import { SubscriptionProductEntity } from "./database/entities/subscription-product.entity";
import { UserRelationEntity } from "./database/entities/user-relation.entity";
import { RuleEntity } from "./database/entities/rule.entity";
import { RulePunishmentEntity } from "./database/entities/rule-punishment.entity";
import { UserReportEntity } from "./database/entities/user-report.entity";
import { PunishmentLogEntity } from "./database/entities/punishment-log.entity";
import { PlayerBanEntity } from "./database/entities/player-ban.entity";
import { MaintenanceEntity } from "./database/entities/maintenance.entity";
import { DemoHighlightsEntity } from "./database/entities/demo-highlights.entity";
import { SteamidHwidEntryEntity } from "./database/entities/steamid-hwid-entry.entity";
import { ToxicityPunishmentMappingEntity } from "./database/entities/toxicity-punishment-mapping.entity";

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
  UserRelationEntity,
  RuleEntity,
  RulePunishmentEntity,
  UserReportEntity,
  PunishmentLogEntity,
  PlayerBanEntity,
  MaintenanceEntity,
  DemoHighlightsEntity,
  SteamidHwidEntryEntity,
  ToxicityPunishmentMappingEntity,
];
