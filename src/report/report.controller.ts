import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { CustomThrottlerGuard } from "../strategy/custom-throttler.guard";
import { ModeratorGuard, WithUser } from "../utils/decorator/with-user";
import {
  CurrentUser,
  CurrentUserDto,
} from "../utils/decorator/current-user";
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
import { ReportMapper } from "./report.mapper";
import { WithPagination } from "../utils/decorator/pagination";
import { NullableIntPipe } from "../utils/pipes";
import { makePage } from "../gateway/util/make-page";
import { ReqLoggingInterceptor } from "../metrics/req-logging.interceptor";

@UseInterceptors(ReqLoggingInterceptor)
@Controller("report")
@ApiTags("report")
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
    private readonly mapper: ReportMapper,
  ) {}

  @ModeratorGuard()
  @WithUser()
  @Post("/admin/punish")
  public async applyPunishment(
    @Body() dto: ApplyPunishmentDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    await this.reportService.applyPunishment(dto, user.steam_id);
  }

  @ModeratorGuard()
  @WithUser()
  @Post("/report/:id")
  public async handleReport(
    @Param("id") id: string,
    @Body() dto: HandleReportDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const report = await this.reportService.handleReport(id, dto, user.steam_id, true);

    return this.mapper.mapReport(report);
  }

  @Get("/report/:id")
  public async getReport(@Param("id") id: string): Promise<ReportDto> {
    const [report, msg] = await this.reportService.getReport(id);
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
  @ApiQuery({
    name: "steam_id",
    required: false,
  })
  @Get("/punishment")
  public async getPaginationLog(
    @Query("page", ParseIntPipe) page: number,
    @Query("per_page", NullableIntPipe) perPage: number = 25,
    @Query("steam_id") steamId?: string,
  ): Promise<PunishmentLogPageDto> {
    const [slice, cnt] = await this.reportService.getPaginationLog(page, perPage, steamId);
    return makePage(slice, cnt, page, perPage, this.mapper.mapPunishmentLog);
  }

  @WithPagination()
  // @ModeratorGuard()
  @Get("/reports")
  public async getReportPage(
    @Query("page", ParseIntPipe) page: number,
    @Query("per_page", NullableIntPipe) perPage: number = 25,
  ): Promise<ReportPageDto> {
    const [items, count] = await this.reportService.getReportPage(page, perPage);
    return makePage(items, count, page, perPage, ([report, msg]) =>
      this.mapper.mapReport(report, msg),
    );
  }
}
