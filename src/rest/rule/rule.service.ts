import { Injectable } from "@nestjs/common";
import { RuleEntity } from "../../entity/rule.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PrettyRuleDto } from "./rule.dto";
import { RulePunishmentEntity } from "../../entity/rule-punishment.entity";

@Injectable()
export class RuleService {
  constructor(
    @InjectRepository(RuleEntity)
    private readonly ruleEntityRepository: Repository<RuleEntity>,
    @InjectRepository(RulePunishmentEntity)
    private readonly rulePunishmentEntityRepository: Repository<RulePunishmentEntity>,
  ) {}

  public async getRules(): Promise<RuleEntity[]> {
    const rules = await this.ruleEntityRepository.find({
      relations: ["punishment"],
    });

    return rules
      .filter((it) => it.parentId === null)
      .map((rule) => this.fillRule(rule, rules))
      .sort((a, b) => a.index - b.index);
  }

  async tryDeleteRule(id: number) {
    // TODO: check if there are existing crimes associated and throw

    // Clear parents
    await this.ruleEntityRepository.update(
      { parentId: id },
      { parentId: null },
    );

    await this.ruleEntityRepository.delete({ id });

    return {
      success: true,
      message: "Rule successfully deleted",
    };
  }

  private fillRule(root: RuleEntity, pool: RuleEntity[]) {
    root.children = pool
      .filter((it) => it.parentId === root.id)
      .map((child) => this.fillRule(child, pool));

    root.children.sort((a, b) => a.index - b.index);
    return root;
  }

  async getReportableRules(): Promise<PrettyRuleDto[]> {
    const allRules = await this.getRules();
    const flatRules = this.flattenRules(allRules);
    const map = new Map<number, RuleEntity>();
    flatRules.forEach((r) => map.set(r.id, r));

    const getFullPrefix = (rule: RuleEntity) => {
      const parent = map.get(rule.parentId);
      return parent
        ? `${getFullPrefix(parent)}.${rule.index + 1}`
        : (rule.index + 1).toString();
    };

    return flatRules
      .filter((r) => r.children.length === 0 && !r.automatic)
      .map((rule) => ({
        id: rule.id,
        fullIndex: getFullPrefix(rule),
        description: rule.description,
        title: rule.title,
        punishment: rule.punishment,
      }));
  }

  public async tryDeletePunishment(id: number) {
    // Clear parents
    await this.ruleEntityRepository.update(
      { punishmentId: id },
      { punishmentId: null },
    );

    await this.rulePunishmentEntityRepository.delete({ id });
    return {
      success: true,
      message: "Punishment successfully deleted",
    };
  }

  private flattenRules(rules: RuleEntity[]): RuleEntity[] {
    return rules.flatMap((rule) => [rule, ...this.flattenRules(rule.children)]);
  }
}
