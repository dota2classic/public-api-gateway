import { Injectable } from "@nestjs/common";
import { PlayerFeedbackEntity } from "../../entity/player-feedback.entity";
import {
  FeedbackDto,
  FeedbackTemplateDto,
  PlayerFeedbackDto,
} from "./feedback.dto";
import { FeedbackEntity } from "../../entity/feedback.entity";
import { UserProfileService } from "../../service/user-profile.service";

@Injectable()
export class FeedbackMapper {
  constructor(private readonly user: UserProfileService) {}
  public mapFeedback = (
    it: PlayerFeedbackEntity,
    ticketId?: string,
  ): FeedbackDto => ({
    id: it.id,
    title: it.feedback.title,
    finished: it.finished,
    comment: it.comment,
    ticketId: ticketId,
    needsTicket: it.feedback.needsTicket,
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
    needsTicket: it.needsTicket,
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
    user: await this.user.userDto(it.steamId),
    options: it.optionResults.map((option) => ({
      id: option.id,
      option: option.option,
      checked: option.checked,
    })),
  });
}
