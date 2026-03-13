import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RuleEntity } from "../entity/rule.entity";
import { RulePunishmentEntity } from "../entity/rule-punishment.entity";
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
