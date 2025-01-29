import { Column, Entity, OneToMany, PrimaryColumn, Relation } from 'typeorm';
import { FeedbackOptionEntity } from './feedback-option.entity';
import { PlayerFeedbackEntity } from './player-feedback.entity';

/**
 * Placeholder entity for a feedback
 */
@Entity({
  name: "feedback_entity"
})
export class FeedbackEntity {
  @PrimaryColumn({ type: "text", name: "tag", unique: true })
  tag: string;

  @OneToMany(() => FeedbackOptionEntity, (t) => t.feedbacks, { eager: false })
  options: Relation<FeedbackOptionEntity>[];

  @OneToMany(() => PlayerFeedbackEntity, (t) => t.feedback, { eager: false })
  submitted: Relation<PlayerFeedbackEntity>[];

  @Column({ name: "title" })
  title: string;
}
