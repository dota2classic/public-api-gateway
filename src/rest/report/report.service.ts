import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserReportEntity } from "../../entity/user-report.entity";
import { DataSource, EntityManager, Repository } from "typeorm";
import { ForumApi } from "../../generated-api/forum";
import { ThreadType } from "../../gateway/shared-types/thread-type";
import { RuleEntity, RuleType } from "../../entity/rule.entity";
import {
  NotificationEntityType,
  NotificationType,
} from "../../entity/notification.entity";
import { NotificationService } from "../notification/notification.service";
import { CurrentUserDto } from "../../utils/decorator/current-user";
import { RulePunishmentEntity } from "../../entity/rule-punishment.entity";
import { PunishmentLogEntity } from "../../entity/punishment-log.entity";
import { PlayerBanEntity } from "../../entity/player-ban.entity";
import { BanReason } from "../../gateway/shared-types/ban";
import { ConfigService } from "@nestjs/config";
import { PlayerFlagsEntity } from "../../entity/player-flags.entity";

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(UserReportEntity)
    private readonly userReportEntityRepository: Repository<UserReportEntity>,
    @InjectRepository(RuleEntity)
    private readonly ruleEntityRepository: Repository<RuleEntity>,
    private readonly forumApi: ForumApi,
    private readonly notification: NotificationService,
    @InjectRepository(PunishmentLogEntity)
    private readonly punishmentLogEntityRepository: Repository<PunishmentLogEntity>,
    @InjectRepository(PlayerBanEntity)
    private readonly playerBanEntityRepository: Repository<PlayerBanEntity>,
    private readonly ds: DataSource,
    private readonly config: ConfigService,
    @InjectRepository(PlayerFlagsEntity)
    private readonly playerFlagsEntityRepository: Repository<PlayerFlagsEntity>,
  ) {}

  public async createLogFromReport(
    report: UserReportEntity,
    punishment: RulePunishmentEntity,
    executorSteamId: string,
  ) {
    return this.createLog(
      report.reportedSteamId,
      executorSteamId,
      report.ruleId,
      punishment.durationHours * 60 * 60,
      punishment.id,
      report.id,
    );
  }

  public async createLog(
    punishedSteamId: string,
    executorSteamId: string,
    ruleId: number,
    durationSeconds: number,
    punishmentId: number,
    reportId?: string,
  ) {
    const rule = await this.ruleEntityRepository.findOne({
      where: { id: ruleId },
    });

    return this.ds.transaction(async (tx) => {
      const log = await tx.save(
        new PunishmentLogEntity(
          ruleId,
          durationSeconds,
          reportId,
          punishmentId,
          punishedSteamId,
          executorSteamId,
        ),
      );

      if (rule.ruleType === RuleType.GAMEPLAY) {
        await this.updateGameplayBan(tx, punishedSteamId, durationSeconds);
      } else if (rule.ruleType === RuleType.COMMUNICATION) {
        await this.updateCommunicationBan(punishedSteamId, durationSeconds);
      }

      return log;
    });
  }

  private async updateGameplayBan(
    tx: EntityManager,
    punishedSteamId: string,
    durationSeconds: number,
  ) {
    let ban: PlayerBanEntity = await tx.findOne<PlayerBanEntity>(
      PlayerBanEntity,
      {
        where: {
          steamId: punishedSteamId,
        },
      },
    );
    if (!ban) {
      ban = await tx.save(
        new PlayerBanEntity(
          punishedSteamId,
          new Date(0),
          BanReason.RULE_VIOLATION,
        ),
      );
    }

    await tx.update<PlayerBanEntity>(
      PlayerBanEntity,
      { steamId: punishedSteamId },
      {
        reason: BanReason.RULE_VIOLATION,
        endTime: () =>
          `greatest(endTime, now()) + interval'${durationSeconds} seconds'`,
      },
    );
  }

  private async updateCommunicationBan(
    punishedSteamId: string,
    durationSeconds: number,
  ) {
    const user = await this.forumApi.forumControllerGetUser(punishedSteamId);
    let muteStart = new Date();
    if (new Date(user.muteUntil).getTime() > muteStart.getTime()) {
      muteStart = new Date(user.muteUntil);
    }
    await this.forumApi.forumControllerUpdateUser(punishedSteamId, {
      muteUntil: new Date(
        muteStart.getTime() + durationSeconds * 1000,
      ).toISOString(),
    });
  }

  public async createMessageReport(
    reporter: CurrentUserDto,
    reported: string,
    ruleId: number,
    comment: string,
    messageId: string,
  ) {
    await this.checkHasPermission(reporter.steam_id);
    const alreadyReported = await this.userReportEntityRepository.exists({
      where: {
        reportedSteamId: reported,
        ruleId: ruleId,
        messageId,
      },
    });
    if (alreadyReported) {
      throw new HttpException({ message: "Такая жалоба уже заведена" }, 400);
    }

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
    matchId: number,
  ) {
    await this.checkHasPermission(reporter.steam_id);
    await this.checkAlreadyReported(reported, ruleId, matchId);

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
      content: `Пользователь https://dotaclassic.ru/players/${report.reportedSteamId} нарушил правило ${this.config.get("api.frontUrl")}/static/rules#${rule.id}
[${rule.title}]
${report.matchId ? `В матче https://dotaclassic.ru/matches/${report.matchId}` : "На форуме"}
${report.comment ? `Комментарий: \n${report.comment}` : ""}
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

  private async checkAlreadyReported(
    steamId: string,
    ruleId: number,
    matchId: number,
  ) {
    const alreadyReported = await this.userReportEntityRepository.exists({
      where: {
        reportedSteamId: steamId,
        ruleId: ruleId,
        matchId: matchId,
      },
    });
    if (alreadyReported) {
      throw new HttpException({ message: "Такая жалоба уже заведена" }, 400);
    }
  }

  private async checkHasPermission(steamId: string) {
    if (
      await this.playerFlagsEntityRepository.exists({
        where: { steamId, disableReports: true },
      })
    ) {
      throw new HttpException(
        { message: "Тебе запрещено создавать жалобы" },
        403,
      );
    }
  }
}
