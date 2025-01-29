import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { FeedbackOptionEntity } from "./feedback-option.entity";
import { PlayerFeedbackEntity } from "./player-feedback.entity";

@Entity({
  name: "player_feedback_option_result_entity",
})
export class PlayerFeedbackOptionResultEntity {
  @ManyToOne(
    () => PlayerFeedbackEntity,
    (t: PlayerFeedbackEntity) => t.optionResults,
  )
  @JoinColumn({
    referencedColumnName: "id",
    name: "player_feedback_id",
  })
  feedback: PlayerFeedbackEntity;

  @PrimaryColumn({ name: "player_feedback_id" })
  playerFeedbackId: number;

  @ManyToOne(() => FeedbackOptionEntity, (t) => t.feedbacks, { eager: true })
  @JoinColumn({
    referencedColumnName: "id",
    name: "feedback_option_id",
  })
  feedbackOption: FeedbackOptionEntity;

  @PrimaryColumn({ name: "feedback_option_id" })
  feedbackOptionId: number;

  @Column({ name: "checked", default: false })
  checked: boolean;

  constructor(playerFeedbackId: number, feedbackOptionId: number) {
    this.playerFeedbackId = playerFeedbackId;
    this.feedbackOptionId = feedbackOptionId;
  }
}
