import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { VirtualColumn2 } from "../virtual-column";

export enum NotificationEntityType {
  FEEDBACK = "FEEDBACK",
  ACHIEVEMENT = "ACHIEVEMENT",
  FEEDBACK_TICKET = "FEEDBACK_TICKET",
  REPORT_TICKET = "REPORT_TICKET",
  PLAYER = "PLAYER",
  MATCH = "MATCH",
}

export enum NotificationType {
  ACHIEVEMENT_COMPLETE = "ACHIEVEMENT_COMPLETE",
  FEEDBACK_CREATED = "FEEDBACK_CREATED",
  TICKET_CREATED = "TICKET_CREATED",
  TICKET_NEW_MESSAGE = "TICKET_NEW_MESSAGE",
  PLAYER_REPORT_BAN = "PLAYER_REPORT_BAN",
  PLAYER_FEEDBACK = "PLAYER_FEEDBACK",
  REPORT_CREATED = "REPORT_CREATED",
  SUBSCRIPTION_PURCHASED = "SUBSCRIPTION_PURCHASED",
  ITEM_DROPPED = "ITEM_DROPPED",
  TRADE_OFFER_EXPIRED = "TRADE_OFFER_EXPIRED",
  TOURNAMENT_READY_CHECK_STARTED = "TOURNAMENT_READY_CHECK_STARTED",
}

@Entity()
export class NotificationEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @PrimaryColumn({ name: "steam_id" })
  steamId: string;

  @CreateDateColumn({
    type: "timestamptz",
    name: "created_at",
    default: () => "now()",
  })
  createdAt: Date;

  @Column({ name: "ttl", type: "interval", default: "1day" })
  ttl: string;

  @Index("idx_notification_entity_acknowledged")
  @Column({ name: "acknowledged", default: false })
  acknowledged: boolean;

  @Column({ name: "entity_id", nullable: false, type: "text" })
  entityId: string;

  @Column({
    enum: NotificationEntityType,
    enumName: "notification_entity_type",
    nullable: false,
    name: "entity_type",
  })
  entityType: NotificationEntityType;

  @Column({
    enum: NotificationType,
    enumName: "notification_type",
    nullable: false,
    name: "notification_type",
  })
  notificationType: NotificationType;

  @Column({ name: "params", nullable: false, type: "jsonb", default: "{}" })
  params: Record<string, unknown>;

  @VirtualColumn2("expiresAt", (t) => t)
  expiresAt: Date;

  constructor(
    steamId: string,
    entityId: string,
    entityType: NotificationEntityType,
    notificationType: NotificationType,
    ttl: string = "1day",
    params: Record<string, unknown> = {},
  ) {
    this.steamId = steamId;
    this.entityId = entityId;
    this.entityType = entityType;
    this.notificationType = notificationType;
    this.ttl = ttl;
    this.params = params;
  }
}
