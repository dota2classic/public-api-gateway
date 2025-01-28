import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { PlayerFeedbackOptionResultEntity } from "./player-feedback-option-result.entity";
import { FeedbackEntity } from "./feedback.entity";

@Entity()
export class FeedbackOptionEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ name: "option" })
  option: string;

  @ManyToOne(() => FeedbackEntity, (t) => t.options, {
    eager: false,
  })
  @JoinColumn({
    referencedColumnName: "tag",
    name: "feedback_tag",
  })
  feedbacks: Relation<FeedbackEntity>[];

  @Column({ name: "feedback_tag" })
  feedbackTag: string;

  @ManyToMany(() => PlayerFeedbackOptionResultEntity, (t) => t.feedbackOption, {
    eager: false,
  })
  submittedOptions: Relation<PlayerFeedbackOptionResultEntity>[];
}
