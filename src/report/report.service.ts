import { HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserReportEntity } from "../database/entities/user-report.entity";
import { DataSource, EntityManager, Repository } from "typeorm";
import { ForumApi } from "../generated-api/forum";
import { ThreadType } from "../gateway/shared-types/thread-type";
import { RuleEntity, RuleType } from "../database/entities/rule.entity";
import {
  NotificationEntityType,
  NotificationType,
} from "../database/entities/notification.entity";
import { NotificationService } from "../notification/notification.service";
import { CurrentUserDto } from "../utils/decorator/current-user";
import { RulePunishmentEntity } from "../database/entities/rule-punishment.entity";
import { PunishmentLogEntity } from "../database/entities/punishment-log.entity";
import { ApplyPunishmentDto, HandleReportDto } from "./report.dto";
import { ForumMessageDTO } from "../generated-api/forum";
import { PlayerBanEntity } from "../database/entities/player-ban.entity";
import { BanReason } from "../gateway/shared-types/ban";
import { ConfigService } from "@nestjs/config";
import { PlayerFlagsEntity } from "../database/entities/player-flags.entity";
import { ToxicityPunishmentMappingEntity } from "../database/entities/toxicity-punishment-mapping.entity";

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
    @InjectRepository(RulePunishmentEntity)
    private readonly rulePunishmentEntityRepository: Repository<RulePunishmentEntity>,
    private readonly ds: DataSource,
    private readonly config: ConfigService,
    @InjectRepository(PlayerFlagsEntity)
    private readonly playerFlagsEntityRepository: Repository<PlayerFlagsEntity>,
    @InjectRepository(ToxicityPunishmentMappingEntity)
    private readonly toxicityMappingRepository: Repository<ToxicityPunishmentMappingEntity>,
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

  public async applyToxicityModerationResult(
    steamId: string,
    score: number,
    reasoning: string,
    matchId: number,
  ): Promise<void> {
    const mapping = await this.toxicityMappingRepository
      .createQueryBuilder("m")
      .where("m.minScore <= :score", { score })
      .orderBy("m.minScore", "DESC")
      .getOne();

    if (!mapping) return;

    const alreadyReported = await this.userReportEntityRepository.exists({
      where: { reportedSteamId: steamId, ruleId: mapping.ruleId, matchId },
    });
    if (alreadyReported) return;

    const report = await this.userReportEntityRepository.save(
      new UserReportEntity("system", steamId, mapping.ruleId, reasoning, matchId),
    );

    await this.createSystemThreadForReport(report, mapping.rule);

    if (mapping.punishmentId) {
      await this.createLog(
        steamId,
        "system",
        mapping.ruleId,
        mapping.punishment.durationHours * 60 * 60,
        mapping.punishmentId,
        report.id,
      );
    }
  }

  private async createSystemThreadForReport(
    report: UserReportEntity,
    rule: RuleEntity,
  ) {
    const thread = await this.forumApi.forumControllerGetThreadForKey({
      threadType: ThreadType.REPORT,
      externalId: report.id,
      title: `[AI] Нарушение правила ${rule.title}`,
      op: "system",
    });

    await this.forumApi.forumControllerPostMessage(thread.id, {
      author: { steam_id: "system", roles: [] },
      content: `[Автоматическая проверка] Пользователь https://dotaclassic.ru/players/${report.reportedSteamId} нарушил правило ${this.config.get("api.frontUrl")}/static/rules#${rule.id}
[${rule.title}]
В матче https://dotaclassic.ru/matches/${report.matchId}
Комментарий AI: ${report.comment}
      `,
    });
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

  public async applyPunishment(dto: ApplyPunishmentDto, executorSteamId: string): Promise<void> {
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

    await this.createLog(
      dto.steamId,
      executorSteamId,
      rule.id,
      punishment.durationHours * 60 * 60,
      punishment.id,
    );
  }

  public async handleReport(
    id: string,
    dto: HandleReportDto,
    executorSteamId: string,
  ): Promise<UserReportEntity> {
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
      { id, handled: false },
      { handled: true },
    );
    if (!uc.affected) {
      throw new NotFoundException();
    }

    if (dto.valid) {
      await this.createLogFromReport(report, punishment, executorSteamId);
    }

    return this.userReportEntityRepository.findOne({
      where: { id },
      relations: ["rule"],
    });
  }

  public async getReport(id: string): Promise<[UserReportEntity, ForumMessageDTO | undefined]> {
    const report = await this.userReportEntityRepository.findOne({ where: { id } });
    const msg = report.messageId
      ? await this.forumApi.forumControllerGetMessage(report.messageId)
      : undefined;
    return [report, msg];
  }

  public async getPaginationLog(
    page: number,
    perPage: number,
    steamId?: string,
  ): Promise<[PunishmentLogEntity[], number]> {
    return this.punishmentLogEntityRepository.findAndCount({
      take: perPage,
      skip: page * perPage,
      relations: ["rule", "punishment"],
      where: { reportedSteamId: steamId || undefined },
      order: { createdAt: "DESC" },
    });
  }

  public async getReportPage(
    page: number,
    perPage: number,
  ): Promise<[[UserReportEntity, ForumMessageDTO | undefined][], number]> {
    const [items, count] = await this.userReportEntityRepository.findAndCount({
      take: perPage,
      skip: perPage * page,
      order: { handled: "ASC", createdAt: "DESC" },
    });

    const itemsWithMessages = await Promise.all(
      items.map(async (item): Promise<[UserReportEntity, ForumMessageDTO | undefined]> => {
        if (item.messageId) {
          return [item, await this.forumApi.forumControllerGetMessage(item.messageId)];
        }
        return [item, undefined];
      }),
    );

    return [itemsWithMessages, count];
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
