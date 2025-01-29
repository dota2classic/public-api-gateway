import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { FeedbackOptionEntity } from './feedback-option.entity';
import { PlayerFeedbackEntity } from './player-feedback.entity';

/**
 * Placeholder entity for a feedback
 */
@Entity({
  name: "feedback_entity",
})
@Index("unique_tag", ["tag"], { unique: true })
export class FeedbackEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    type: "text",
    name: "tag",
  })
  tag: string;

  @OneToMany(() => FeedbackOptionEntity, (t) => t.feedbacks, { eager: false })
  options: Relation<FeedbackOptionEntity>[];

  @OneToMany(() => PlayerFeedbackEntity, (t) => t.feedback, { eager: false })
  submitted: Relation<PlayerFeedbackEntity>[];

  @Column({ name: "title" })
  title: string;
}
