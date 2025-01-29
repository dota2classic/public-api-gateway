import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FeedbackEntity } from "../../entity/feedback.entity";
import { FeedbackOptionEntity } from "../../entity/feedback-option.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AdminGuard, WithUser } from "../../utils/decorator/with-user";
import {
  CreateFeedbackDto,
  CreateFeedbackOptionDto,
  FeedbackTemplateDto,
  PlayerFeedbackPageDto,
  UpdateFeedbackDto,
} from "./feedback.dto";
import { FeedbackService } from "./feedback.service";
import { FeedbackMapper } from "./feedback.mapper";
import { WithPagination } from "../../utils/decorator/pagination";
import { PlayerFeedbackEntity } from "../../entity/player-feedback.entity";
import { makePage } from "../../gateway/util/make-page";
import { NullableIntPipe } from "../../utils/pipes";

@Controller("adminFeedback")
@ApiTags("adminFeedback")
export class AdminFeedbackController {
  constructor(
    @InjectRepository(FeedbackEntity)
    private readonly feedbackEntityRepository: Repository<FeedbackEntity>,
    @InjectRepository(FeedbackOptionEntity)
    private readonly feedbackOptionEntityRepository: Repository<FeedbackOptionEntity>,
    private readonly feedbackService: FeedbackService,
    private readonly mapper: FeedbackMapper,
    @InjectRepository(PlayerFeedbackEntity)
    private readonly playerFeedbackEntityRepository: Repository<PlayerFeedbackEntity>,
  ) {}

  @AdminGuard()
  @WithUser()
  @WithPagination()
  @Get("/playerFeedback")
  public async getPlayerFeedback(
    @Query("page", ParseIntPipe) page: number,
    @Query("per_page", NullableIntPipe) perPage: number = 25,
  ): Promise<PlayerFeedbackPageDto> {
    const [data, count] =
      await this.playerFeedbackEntityRepository.findAndCount({
        order: {
          createdAt: "ASC",
        },
        take: perPage,
        skip: perPage * page,
      });

    return makePage(data, count, page, perPage, this.mapper.mapPlayerFeedback);
  }

  @AdminGuard()
  @WithUser()
  @Post()
  public async createFeedback(
    @Body() b: CreateFeedbackDto,
  ): Promise<FeedbackTemplateDto> {
    return this.feedbackService
      .createFeedback(b.tag, b.title)
      .then(this.mapper.mapFeedbackTemplate);
  }

  @AdminGuard()
  @WithUser()
  @Patch(":feedbackId")
  public async updateFeedback(
    @Param("feedbackId") feedbackId: number,
    @Body() b: UpdateFeedbackDto,
  ): Promise<FeedbackTemplateDto> {
    return this.feedbackService
      .updateFeedback(feedbackId, b.title, b.tag)
      .then(this.mapper.mapFeedbackTemplate);
  }

  @AdminGuard()
  @WithUser()
  @Get(":feedbackId")
  public async getFeedbackTemplate(
    @Param("feedbackId") feedbackId: number,
  ): Promise<FeedbackTemplateDto> {
    return this.feedbackEntityRepository
      .findOneOrFail({ where: { id: feedbackId }, relations: ["options"] })
      .then(this.mapper.mapFeedbackTemplate);
  }

  @AdminGuard()
  @WithUser()
  @Delete(":feedbackId")
  public async deleteFeedback(
    @Param("feedbackId") feedbackId: number,
  ): Promise<void> {
    return this.feedbackService.deleteFeedback(feedbackId);
  }

  @AdminGuard()
  @WithUser()
  @Post(":feedbackId/option")
  public async createOption(
    @Param("feedbackId") feedbackId: number,
    @Body() dto: CreateFeedbackOptionDto,
  ): Promise<FeedbackTemplateDto> {
    return this.feedbackService
      .createFeedbackOption(feedbackId, dto.option)
      .then(this.mapper.mapFeedbackTemplate);
  }

  @AdminGuard()
  @WithUser()
  @Patch(":feedbackId/option/:id")
  public async editOption(
    @Param("feedbackId") feedbackId: number,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: CreateFeedbackOptionDto,
  ): Promise<FeedbackTemplateDto> {
    return this.feedbackService
      .editFeedbackOption(feedbackId, id, dto.option)
      .then(this.mapper.mapFeedbackTemplate);
  }

  @AdminGuard()
  @WithUser()
  @Delete(":feedbackId/option/:id")
  public async deleteOption(
    @Param("feedbackId") feedbackId: number,
    @Param("id", ParseIntPipe) id: number,
  ): Promise<FeedbackTemplateDto> {
    return this.feedbackService
      .deleteFeedbackOption(feedbackId, id)
      .then(this.mapper.mapFeedbackTemplate);
  }

  @AdminGuard()
  @WithUser()
  @Get("/")
  public async getFeedbacks(): Promise<FeedbackTemplateDto[]> {
    return this.feedbackEntityRepository
      .find({
        relations: ["options"],
      })
      .then((all) => all.map(this.mapper.mapFeedbackTemplate));
  }
}
