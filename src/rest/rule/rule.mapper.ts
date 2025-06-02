import { Injectable } from "@nestjs/common";
import { RuleEntity } from "../../entity/rule.entity";
import { RuleDto, RulePunishmentDto } from "./rule.dto";
import { RulePunishmentEntity } from "../../entity/rule-punishment.entity";

@Injectable()
export class RuleMapper {
  public mapRule = (rule: RuleEntity): RuleDto => {
    return {
      id: rule.id.toString(),
      index: rule.index,
      description: rule.description,
      title: rule.title,
      automatic: rule.automatic,
      parentId: rule.parentId,
      children: rule.children ? rule.children.map(this.mapRule) : [],
      punishment: rule.punishment
        ? this.mapPunishment(rule.punishment)
        : undefined,
    };
  };

  public mapPunishment = (
    punishment: RulePunishmentEntity,
  ): RulePunishmentDto => ({
    id: punishment.id,
    title: punishment.title,
    durationHours: punishment.durationHours,
  });
}
