import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FeedbackMapper } from "./feedback.mapper";
import { SubmitFeedbackDto } from "./feedback.dto";
import { FeedbackService } from "./feedback.service";
import { WithUser } from "../../utils/decorator/with-user";
import {
  CurrentUser,
  CurrentUserDto,
} from "../../utils/decorator/current-user";

@Controller("feedback")
@ApiTags("feedback")
export class FeedbackController {
  constructor(
    private readonly mapper: FeedbackMapper,
    private readonly feedbackService: FeedbackService,
  ) {}

  // TODO: with user
  @Post(":id")
  @WithUser()
  public async submitFeedbackResult(
    @CurrentUser() user: CurrentUserDto,
    @Param("id", ParseIntPipe) feedbackId: number,
    @Body() dto: SubmitFeedbackDto,
  ) {
    return this.feedbackService
      .submitFeedbackResult(
        feedbackId,
        dto.options,
        dto.comment,
        user.steam_id,
        true,
        user,
      )
      .then(([feedback, ticketId]) =>
        this.mapper.mapFeedback(feedback, ticketId),
      );
  }

  @Get(":id")
  @WithUser()
  public async getFeedback(
    @CurrentUser() user: CurrentUserDto,
    @Param("id", ParseIntPipe) feedbackId: number,
  ) {
    return this.feedbackService
      .getFeedback(feedbackId, user.steam_id)
      .then(this.mapper.mapFeedback);
  }
}
