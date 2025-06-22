import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ReqLoggingInterceptor } from "../../middleware/req-logging.interceptor";
import { ApiTags } from "@nestjs/swagger";
import { CustomThrottlerGuard } from "../strategy/custom-throttler.guard";
import { ModeratorGuard, WithUser } from "../../utils/decorator/with-user";
import {
  CurrentUser,
  CurrentUserDto,
} from "../../utils/decorator/current-user";
import {
  ApplyPunishmentDto,
  HandleReportDto,
  PunishmentLogPageDto,
  ReportDto,
  ReportMessageDto,
  ReportPageDto,
  ReportPlayerInMatchDto,
} from "./report.dto";
import { ReportService } from "./report.service";
import { UserReportEntity } from "../../entity/user-report.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ReportMapper } from "./report.mapper";
import { ForumApi, ForumMessageDTO } from "../../generated-api/forum";
import { RulePunishmentEntity } from "../../entity/rule-punishment.entity";
import { WithPagination } from "../../utils/decorator/pagination";
import { PunishmentLogEntity } from "../../entity/punishment-log.entity";
import { NullableIntPipe } from "../../utils/pipes";
import { makePage } from "../../gateway/util/make-page";
import { RuleEntity } from "../../entity/rule.entity";

@UseInterceptors(ReqLoggingInterceptor)
@Controller("report")
@ApiTags("report")
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
    @InjectRepository(UserReportEntity)
    private readonly userReportEntityRepository: Repository<UserReportEntity>,
    @InjectRepository(RulePunishmentEntity)
    private readonly rulePunishmentEntityRepository: Repository<RulePunishmentEntity>,
    @InjectRepository(PunishmentLogEntity)
    private readonly punishmentLogEntityRepository: Repository<PunishmentLogEntity>,
    @InjectRepository(RuleEntity)
    private readonly ruleEntityRepository: Repository<RuleEntity>,
    private readonly forumApi: ForumApi,
    private readonly mapper: ReportMapper,
  ) {}

  @ModeratorGuard()
  @WithUser()
  @Post("/admin/punish")
  public async applyPunishment(
    @Body() dto: ApplyPunishmentDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const rule = await this.ruleEntityRepository.findOneOrFail({
      where: { id: dto.ruleId },
      relations: ["punishment"],
    });

    const punishment = dto.overridePunishmentId
      ? await this.rulePunishmentEntityRepository.findOne({
          where: { id: dto.overridePunishmentId },
        })
      : rule.punishment;

    if (!punishment) {
      throw new NotFoundException("Punishment not found for rule or override");
    }

    await this.reportService.createLog(
      dto.steamId,
      user.steam_id,
      rule.id,
      punishment.durationHours * 60 * 60,
      punishment.id,
    );
  }

  @ModeratorGuard()
  @WithUser()
  @Post("/report/:id")
  public async handleReport(
    @Param("id") id: string,
    @Body() dto: HandleReportDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const report = await this.userReportEntityRepository.findOne({
      where: { id, handled: false },
      relations: ["rule"],
    });

    const punishment = dto.overridePunishmentId
      ? await this.rulePunishmentEntityRepository.findOne({
          where: { id: dto.overridePunishmentId },
        })
      : report.rule.punishment;

    if (!punishment) {
      throw new NotFoundException("Punishment not found for rule or override");
    }
    const uc = await this.userReportEntityRepository.update(
      {
        id,
        handled: false,
      },
      { handled: true },
    );
    if (!uc.affected) {
      throw new NotFoundException();
    }

    if (dto.valid) {
      await this.reportService.createLogFromReport(
        report,
        punishment,
        user.steam_id,
      );
    }

    return this.userReportEntityRepository
      .findOne({
        where: { id },
        relations: ["rule"],
      })
      .then(this.mapper.mapReport);
  }

  @Get("/report/:id")
  public async getReport(@Param("id") id: string): Promise<ReportDto> {
    const report = await this.userReportEntityRepository.findOne({
      where: { id },
    });
    const msg = report.messageId
      ? await this.forumApi.forumControllerGetMessage(report.messageId)
      : undefined;

    return this.mapper.mapReport(report, msg);
  }

  @Post("/match")
  @UseGuards(CustomThrottlerGuard)
  @WithUser()
  public async reportPlayerInMatch(
    @CurrentUser() user: CurrentUserDto,
    @Body() dto: ReportPlayerInMatchDto,
  ) {
    await this.reportService.createReport(
      user,
      dto.steamId,
      dto.ruleId,
      dto.comment,
      dto.matchId,
    );
  }

  @Post("/message")
  @UseGuards(CustomThrottlerGuard)
  @WithUser()
  public async reportMessage(
    @CurrentUser() user: CurrentUserDto,
    @Body() dto: ReportMessageDto,
  ) {
    await this.reportService.createMessageReport(
      user,
      dto.steamId,
      dto.ruleId,
      dto.comment,
      dto.messageId,
    );
  }

  @WithPagination()
  @Get("/punishment")
  public async getPaginationLog(
    @Query("page", ParseIntPipe) page: number,
    @Query("per_page", NullableIntPipe) perPage: number = 25,
  ): Promise<PunishmentLogPageDto> {
    // mapPunishmentLog
    const [slice, cnt] = await this.punishmentLogEntityRepository.findAndCount({
      take: perPage,
      skip: page * perPage,
      relations: ["rule", "punishment"],
      order: {
        createdAt: "DESC",
      },
    });

    return makePage(slice, cnt, page, perPage, this.mapper.mapPunishmentLog);
  }

  @WithPagination()
  // @WithUser()
  // @ModeratorGuard()
  @Get("/reports")
  public async getReportPage(
    @Query("page", ParseIntPipe) page: number,
    @Query("per_page", NullableIntPipe) perPage: number = 25,
  ): Promise<ReportPageDto> {
    const [items, count] = await this.userReportEntityRepository.findAndCount({
      take: perPage,
      skip: perPage * page,
      order: {
        handled: "ASC",
        createdAt: "DESC",
      },
    });

    const itemsWithMessages: [UserReportEntity, ForumMessageDTO | undefined][] =
      await Promise.all(
        items.map(async (item) => {
          if (item.messageId) {
            return [
              item,
              await this.forumApi.forumControllerGetMessage(item.messageId),
            ];
          }
          return [item, undefined];
        }),
      );

    return makePage(itemsWithMessages, count, page, perPage, ([report, msg]) =>
      this.mapper.mapReport(report, msg),
    );
  }
}
