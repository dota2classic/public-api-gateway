import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FeedbackEntity } from "../../entity/feedback.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { PlayerFeedbackEntity } from "../../entity/player-feedback.entity";
import { FeedbackMapper } from "./feedback.mapper";
import { SubmitFeedbackDto } from "./feedback.dto";
import { FeedbackService } from "./feedback.service";
import { WithUser } from "../../utils/decorator/with-user";
import {
  CurrentUser,
  CurrentUserDto,
} from "../../utils/decorator/current-user";
import { ForumApi } from "../../generated-api/forum";
import { EventBus } from "@nestjs/cqrs";

@Controller("feedback")
@ApiTags("feedback")
export class FeedbackController {
  constructor(
    @InjectRepository(FeedbackEntity)
    private readonly feedbackEntityRepository: Repository<FeedbackEntity>,
    @InjectRepository(PlayerFeedbackEntity)
    private readonly playerFeedbackEntityRepository: Repository<PlayerFeedbackEntity>,
    private readonly mapper: FeedbackMapper,
    private readonly feedbackService: FeedbackService,
    private readonly forumApi: ForumApi,
    private readonly ebus: EventBus,
  ) {}

  @Get("test")
  public async getAll() {
    return this.playerFeedbackEntityRepository
      .find()
      .then((all) => all.map(this.mapper.mapFeedback));
  }

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
      .then(this.mapper.mapFeedback);
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
