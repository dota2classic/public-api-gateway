import { Injectable } from "@nestjs/common";
import { PlayerFeedbackEntity } from "../../entity/player-feedback.entity";
import {
  FeedbackDto,
  FeedbackTemplateDto,
  PlayerFeedbackDto,
} from "./feedback.dto";
import { FeedbackEntity } from "../../entity/feedback.entity";
import { UserRepository } from "../../cache/user/user.repository";

@Injectable()
export class FeedbackMapper {
  constructor(private readonly uRep: UserRepository) {}
  public mapFeedback = (it: PlayerFeedbackEntity): FeedbackDto => ({
    id: it.id,
    title: it.feedback.title,
    finished: it.finished,
    comment: it.comment,
    options: it.optionResults.map((option) => ({
      id: option.id,
      option: option.option,
      checked: option.checked,
    })),
  });

  public mapFeedbackTemplate = (it: FeedbackEntity): FeedbackTemplateDto => ({
    tag: it.tag,
    id: it.id,
    title: it.title,
    options: it.options.map((option) => ({
      id: option.id,
      option: option.option,
    })),
  });
  public mapPlayerFeedback = async (
    it: PlayerFeedbackEntity,
  ): Promise<PlayerFeedbackDto> => ({
    id: it.id,
    title: it.feedback.title,
    comment: it.comment,
    user: await this.uRep.userDto(it.steamId),
    options: it.optionResults.map((option) => ({
      id: option.id,
      option: option.option,
      checked: option.checked,
    })),
  });
}
