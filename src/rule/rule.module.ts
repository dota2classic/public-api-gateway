import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RuleEntity } from "../database/entities/rule.entity";
import { RulePunishmentEntity } from "../database/entities/rule-punishment.entity";
import { RuleController } from "./rule.controller";
import { RuleService } from "./rule.service";
import { RuleMapper } from "./rule.mapper";

@Module({
  imports: [TypeOrmModule.forFeature([RuleEntity, RulePunishmentEntity])],
  controllers: [RuleController],
  providers: [RuleService, RuleMapper],
  exports: [RuleMapper, RuleService],
})
export class RuleModule {}
