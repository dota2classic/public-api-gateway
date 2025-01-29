import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PlayerFeedbackEntity } from "./player-feedback.entity";

@Entity({
  name: "player_feedback_option_result_entity",
})
export class PlayerFeedbackOptionResultEntity {
  @PrimaryGeneratedColumn("increment", {
    primaryKeyConstraintName: "PK_player_feedback_option",
  })
  id: number;

  @ManyToOne(
    () => PlayerFeedbackEntity,
    (t: PlayerFeedbackEntity) => t.optionResults,
  )
  @JoinColumn({
    referencedColumnName: "id",
    name: "player_feedback_id",
  })
  feedback: PlayerFeedbackEntity;

  @Column({ name: "player_feedback_id" })
  playerFeedbackId: number;

  @Column({ name: "option" })
  option: string;

  @Column({ name: "checked", default: false })
  checked: boolean;

  constructor(playerFeedbackId: number, option: string) {
    this.playerFeedbackId = playerFeedbackId;
    this.option = option;
  }
}
