import { Injectable } from "@nestjs/common";
import { RuleMapper } from "../rule/rule.mapper";
import { MatchMapper } from "../match/match.mapper";
import { ForumMapper } from "../forum/forum.mapper";
import { UserReportEntity } from "../../entity/user-report.entity";
import { UserProfileService } from "../../service/user-profile.service";
import { PunishmentLogDto, ReportDto } from "./report.dto";
import { ForumMessageDTO } from "../../generated-api/forum";
import { PunishmentLogEntity } from "../../entity/punishment-log.entity";

@Injectable()
export class ReportMapper {
  constructor(
    private readonly rule: RuleMapper,
    private readonly match: MatchMapper,
    private readonly forum: ForumMapper,
    private readonly user: UserProfileService,
  ) {}

  public mapReport = async (
    report: UserReportEntity,
    message?: ForumMessageDTO,
  ): Promise<ReportDto> => {
    const [reporter, reported] = await Promise.combine([
      this.user.userDto(report.reporterSteamId),
      this.user.userDto(report.reportedSteamId),
    ]);

    return {
      id: report.id,
      reported,
      reporter,
      rule: this.rule.mapRule(report.rule),
      matchId: report.matchId,
      handled: report.handled,
      createdAt: report.createdAt.toISOString(),
      message: message && (await this.forum.mapApiMessage(message)),
    };
  };

  public mapPunishmentLog = async (
    log: PunishmentLogEntity,
  ): Promise<PunishmentLogDto> => {
    const [reported, executor] = await Promise.combine([
      this.user.userDto(log.reportedSteamId),
      this.user.userDto(log.executorSteamId),
    ]);
    return {
      id: log.id,
      createdAt: log.createdAt.toISOString(),
      reported,
      executor,
      reportId: log.reportId,
      duration: log.banDurationSeconds,
      rule: this.rule.mapRule(log.rule),
      punishment: this.rule.mapPunishment(log.punishment),
    };
  };
}
