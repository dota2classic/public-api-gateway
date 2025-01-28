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
  ) {}

  @Get("test")
  public async getAll() {
    return this.playerFeedbackEntityRepository
      .find()
      .then((all) => all.map(this.mapper.mapFeedback));
  }

  // TODO: with user
  @Post("submit/:id")
  public async submitFeedbackResult(
    @Param("id", ParseIntPipe) feedbackId: number,
    @Body() dto: SubmitFeedbackDto,
  ) {
    return this.feedbackService
      .submitFeedbackResult(feedbackId, dto.options, dto.comment)
      .then(this.mapper.mapFeedback);
  }
}
