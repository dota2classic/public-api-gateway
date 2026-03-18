import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReportController } from "./report.controller";
import { ReportService } from "./report.service";
import { ReportMapper } from "./report.mapper";
import { PlayerRuleBrokenHandler } from "./event-handler/player-rule-broken.handler";
import { ForumMapper } from "../forum/forum.mapper";
import { UserReportEntity } from "../database/entities/user-report.entity";
import { RuleEntity } from "../database/entities/rule.entity";
import { PunishmentLogEntity } from "../database/entities/punishment-log.entity";
import { PlayerBanEntity } from "../database/entities/player-ban.entity";
import { PlayerFlagsEntity } from "../database/entities/player-flags.entity";
import { RulePunishmentEntity } from "../database/entities/rule-punishment.entity";
import { ToxicityPunishmentMappingEntity } from "../database/entities/toxicity-punishment-mapping.entity";
import { RuleModule } from "../rule/rule.module";
import { NotificationModule } from "../notification/notification.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserReportEntity,
      RuleEntity,
      PunishmentLogEntity,
      PlayerBanEntity,
      PlayerFlagsEntity,
      RulePunishmentEntity,
      ToxicityPunishmentMappingEntity,
    ]),
    RuleModule,
    NotificationModule,
  ],
  controllers: [ReportController],
  providers: [ReportService, ReportMapper, PlayerRuleBrokenHandler, ForumMapper],
  exports: [ReportService],
})
export class ReportModule {}
