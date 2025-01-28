import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PlayerFeedbackEntity } from "./player-feedback.entity";

@Entity()
export class NotificationEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @PrimaryColumn({ name: "steam_id" })
  steamId: string;

  @CreateDateColumn({ name: "created_at", default: () => "now()" })
  createdAt: Date;

  @Column({ name: "ttl", type: "interval", default: "1day" })
  ttl: string;

  @Column({ name: "acknowledged", default: false })
  acknowledged: boolean;

  // Notification types
  @ManyToOne(
    () => PlayerFeedbackEntity,
    (t: PlayerFeedbackEntity) => t.notification,
    { nullable: true, eager: true },
  )
  @JoinColumn({
    referencedColumnName: "id",
    name: "player_feedback_id",
  })
  feedback?: PlayerFeedbackEntity;

  @Column({ name: "player_feedback_id", nullable: true })
  playerFeedbackId: number;

  constructor(steamId: string) {
    this.steamId = steamId;
  }
}
