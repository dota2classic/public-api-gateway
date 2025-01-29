import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { FeedbackEntity } from "./feedback.entity";

@Entity({
  name: "feedback_option_entity",
})
export class FeedbackOptionEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ name: "option" })
  option: string;

  @ManyToOne(() => FeedbackEntity, (t) => t.options, {
    eager: false,
  })
  @JoinColumn({
    referencedColumnName: "id",
    name: "feedback_id",
  })
  feedbacks: Relation<FeedbackEntity>[];

  @Column({ name: "feedback_id" })
  feedbackId: number;

  constructor(option: string, feedbackId: number) {
    this.option = option;
    this.feedbackId = feedbackId;
  }
}
