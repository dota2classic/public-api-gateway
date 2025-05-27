import { Injectable } from "@nestjs/common";
import { RuleEntity } from "../../entity/rule.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class RuleService {
  constructor(
    @InjectRepository(RuleEntity)
    private readonly ruleEntityRepository: Repository<RuleEntity>,
  ) {}

  public async getRules(): Promise<RuleEntity[]> {
    const rules = await this.ruleEntityRepository.find();

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
}
