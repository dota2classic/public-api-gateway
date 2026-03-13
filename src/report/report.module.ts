import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReportController } from "./report.controller";
import { ReportService } from "./report.service";
import { ReportMapper } from "./report.mapper";
import { PlayerRuleBrokenHandler } from "./event-handler/player-rule-broken.handler";
import { ForumMapper } from "../forum/forum.mapper";
import { UserReportEntity } from "../entity/user-report.entity";
import { RuleEntity } from "../entity/rule.entity";
import { PunishmentLogEntity } from "../entity/punishment-log.entity";
import { PlayerBanEntity } from "../entity/player-ban.entity";
import { PlayerFlagsEntity } from "../entity/player-flags.entity";
import { RulePunishmentEntity } from "../entity/rule-punishment.entity";
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
    ]),
    RuleModule,
    NotificationModule,
  ],
  controllers: [ReportController],
  providers: [ReportService, ReportMapper, PlayerRuleBrokenHandler, ForumMapper],
})
export class ReportModule {}
