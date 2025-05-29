import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { RulePunishmentEntity } from "./rule-punishment.entity";
import { UserReportEntity } from "./user-report.entity";

@Entity("rule_entity")
export class RuleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: "index",
    type: "smallint",
  })
  index: number;

  @Column({
    default: "Правило",
  })
  title: string;

  @Column({
    default: "",
  })
  description: string;

  @ManyToOne((type) => RuleEntity, (category) => category.children, {
    eager: false,
  })
  @JoinColumn({
    referencedColumnName: "id",
    name: "parent_id",
  })
  parent: Relation<RuleEntity>;

  @Column({
    name: "parent_id",
    nullable: true,
  })
  parentId: number;

  @ManyToOne((type) => RulePunishmentEntity, (punishment) => punishment.rules, {
    eager: true,
  })
  @JoinColumn({
    referencedColumnName: "id",
    name: "punishment_id",
  })
  punishment?: Relation<RulePunishmentEntity>;

  @Column({
    name: "punishment_id",
    nullable: true,
  })
  punishmentId?: number;

  @OneToMany((type) => RuleEntity, (category) => category.parent)
  children: Relation<RuleEntity>[];

  @OneToMany((type) => UserReportEntity, (report) => report.rule)
  reports: Relation<RuleEntity>[];
}
