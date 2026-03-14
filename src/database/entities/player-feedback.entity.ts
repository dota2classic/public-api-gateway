import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { FeedbackEntity } from './feedback.entity';
import { PlayerFeedbackOptionResultEntity } from './player-feedback-option-result.entity';

/**
 * Actual submitted feedback
 */
@Entity({
  name: "player_feedback_entity"
})
export class PlayerFeedbackEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => FeedbackEntity, (t) => t.options, { eager: true })
  @JoinColumn({
    referencedColumnName: "tag",
    name: "feedback_tag",
  })
  feedback: FeedbackEntity;

  @Column({ name: "feedback_tag" })
  feedbackTag: string;

  @Column({ name: "steam_id" })
  steamId: string;

  @OneToMany(() => PlayerFeedbackOptionResultEntity, (t) => t.feedback, {
    eager: true,
  })
  optionResults: Relation<PlayerFeedbackOptionResultEntity>[];

  @Column({ name: "comment", nullable: true, default: null })
  comment: string;

  @Column({ name: "finished", default: false })
  finished: boolean;

  @CreateDateColumn({ name: "created_at", type: "timestamptz", default: () => "now()" })
  createdAt: Date;

  constructor(feedbackTag: string, steamId: string) {
    this.feedbackTag = feedbackTag;
    this.steamId = steamId;
  }
}
