import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { RulePunishmentEntity } from "./rule-punishment.entity";
import { RuleEntity } from "./rule.entity";

@Entity("toxicity_punishment_mapping")
export class ToxicityPunishmentMappingEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    name: "min_score",
    type: "int",
    unique: true,
  })
  minScore: number;

  @ManyToOne(() => RulePunishmentEntity, { nullable: true, eager: true })
  @JoinColumn({ name: "punishment_id" })
  punishment?: Relation<RulePunishmentEntity>;

  @Column({ name: "punishment_id", nullable: true })
  punishmentId?: number;

  @ManyToOne(() => RuleEntity, { eager: true })
  @JoinColumn({ name: "rule_id" })
  rule: Relation<RuleEntity>;

  @Column({ name: "rule_id" })
  ruleId: number;
}
