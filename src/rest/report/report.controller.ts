import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ReqLoggingInterceptor } from "../../middleware/req-logging.interceptor";
import { ApiTags } from "@nestjs/swagger";
import { CustomThrottlerGuard } from "../strategy/custom-throttler.guard";
import { WithUser } from "../../utils/decorator/with-user";
import {
  CurrentUser,
  CurrentUserDto,
} from "../../utils/decorator/current-user";
import { ReportMessageDto, ReportPlayerInMatchDto } from "./report.dto";
import { ReportService } from "./report.service";

@UseInterceptors(ReqLoggingInterceptor)
@Controller("report")
@ApiTags("report")
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

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
}
