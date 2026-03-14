import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { RuleEntity } from "./rule.entity";
import { PunishmentLogEntity } from './punishment-log.entity';

@Entity("rule_punishment")
export class RulePunishmentEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    name: "title",
  })
  title: string;

  @Column({
    name: "duration_hours",
    type: "int",
  })
  durationHours: number;

  @OneToMany((type) => RuleEntity, (category) => category.punishment)
  rules: Relation<RuleEntity>[];

  @OneToMany((type) => PunishmentLogEntity, (log) => log.punishment)
  punishments: Relation<PunishmentLogEntity>[];
}
