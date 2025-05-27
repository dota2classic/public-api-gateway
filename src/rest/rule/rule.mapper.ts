import { Injectable } from "@nestjs/common";
import { RuleEntity } from "../../entity/rule.entity";
import { RuleDto } from "./rule.dto";

@Injectable()
export class RuleMapper {
  public mapRule = (rule: RuleEntity): RuleDto => {
    return {
      id: rule.id.toString(),
      index: rule.index,
      description: rule.description,
      parentId: rule.parentId,
      children: rule.children ? rule.children.map(this.mapRule) : [],
    };
  };
}
