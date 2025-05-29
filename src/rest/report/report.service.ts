import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserReportEntity } from "../../entity/user-report.entity";
import { Repository } from "typeorm";
import { ForumApi } from "../../generated-api/forum";
import { ThreadType } from "../../gateway/shared-types/thread-type";
import { RuleEntity } from "../../entity/rule.entity";
import {
  NotificationEntityType,
  NotificationType,
} from "../../entity/notification.entity";
import { NotificationService } from "../notification/notification.service";
import { CurrentUserDto } from "../../utils/decorator/current-user";

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(UserReportEntity)
    private readonly userReportEntityRepository: Repository<UserReportEntity>,
    @InjectRepository(RuleEntity)
    private readonly ruleEntityRepository: Repository<RuleEntity>,
    private readonly forumApi: ForumApi,
    private readonly notification: NotificationService,
  ) {}

  public async createMessageReport(
    reporter: CurrentUserDto,
    reported: string,
    ruleId: number,
    comment: string,
    messageId: string,
  ) {
    let report = new UserReportEntity(
      reporter.steam_id,
      reported,
      ruleId,
      comment,
    );
    report.messageId = messageId;
    report = await this.userReportEntityRepository.save(report);

    await this.createThreadForReport(reporter, report);
  }

  public async createReport(
    reporter: CurrentUserDto,
    reported: string,
    ruleId: number,
    comment: string,
    matchId?: number,
  ) {
    const report = await this.userReportEntityRepository.save(
      new UserReportEntity(
        reporter.steam_id,
        reported,
        ruleId,
        comment,
        matchId,
      ),
    );

    await this.createThreadForReport(reporter, report);
  }

  private async createThreadForReport(
    reporter: CurrentUserDto,
    report: UserReportEntity,
  ) {
    const rule = await this.ruleEntityRepository.findOne({
      where: { id: report.ruleId },
    });

    const thread = await this.forumApi.forumControllerGetThreadForKey({
      threadType: ThreadType.REPORT,
      externalId: report.id,
      title: `Нарушение правила ${rule.title}`,
      op: report.reporterSteamId,
    });

    const msg = await this.forumApi.forumControllerPostMessage(thread.id, {
      author: reporter,
      content: `Пользователь https://dotaclassic.ru/players/${report.reportedSteamId} нарушил правило https://dev.dotaclassic.ru/static/rules/new#${rule.id}
[${rule.title}]
${report.comment}
      `,
    });

    await this.notification.createNotification(
      reporter.steam_id,
      thread.id,
      NotificationEntityType.REPORT_TICKET,
      NotificationType.REPORT_CREATED,
      "10m",
    );
  }
}
