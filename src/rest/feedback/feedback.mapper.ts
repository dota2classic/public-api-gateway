import { Injectable } from "@nestjs/common";
import { PlayerFeedbackEntity } from "../../entity/player-feedback.entity";
import { FeedbackDto } from "./feedback.dto";

@Injectable()
export class FeedbackMapper {
  public mapFeedback = (it: PlayerFeedbackEntity): FeedbackDto => ({
    id: it.id,
    title: it.feedback.title,
    finished: it.finished,
    comment: it.comment,
    options: it.optionResults.map((option) => ({
      id: option.feedbackOptionId,
      name: option.feedbackOption.option,
      checked: option.checked,
    })),
  });
}
