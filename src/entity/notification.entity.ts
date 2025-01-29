import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { VirtualColumn2 } from "../virtual-column";
import { PlayerFeedbackEntity } from "./player-feedback.entity";
import { FeedbackEntity } from "./feedback.entity";

export enum NotificationEntityType {
  FEEDBACK = "FEEDBACK",
  ACHIEVEMENT = "ACHIEVEMENT",
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

  @Column({ name: "acknowledged", default: false })
  acknowledged: boolean;

  @Column({ name: "entity_id", nullable: false })
  entityId: number;

  @Column({
    enum: NotificationEntityType,
    enumName: "notification_entity_type",
    nullable: false,
    name: "entity_type",
  })
  entityType: NotificationEntityType;

  @VirtualColumn2("playerFeedback", (t) => t)
  playerFeedback?: PlayerFeedbackEntity;

  @VirtualColumn2("feedback", (t) => t)
  feedback?: FeedbackEntity;

  @VirtualColumn2("expiresAt", (t) => t)
  expiresAt: Date;

  constructor(
    steamId: string,
    entityId: number,
    entityType: NotificationEntityType,
    ttl: string = "1day",
  ) {
    this.steamId = steamId;
    this.entityId = entityId;
    this.entityType = entityType;
    this.ttl = ttl;
  }
}
