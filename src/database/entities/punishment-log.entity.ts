import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { RuleEntity } from "./rule.entity";
import { UserReportEntity } from "./user-report.entity";
import { RulePunishmentEntity } from "./rule-punishment.entity";

@Entity("punishment_log")
export class PunishmentLogEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ManyToOne(() => RuleEntity, (t) => t.punishments)
  @JoinColumn({
    referencedColumnName: "id",
    name: "rule_id",
  })
  rule: Relation<RuleEntity>;

  @Column({
    name: "rule_id",
  })
  ruleId: number;

  @CreateDateColumn({
    name: "created_at",
  })
  createdAt: Date;

  @Column({
    name: "ban_duration_seconds",
  })
  banDurationSeconds: number;

  @OneToOne(() => UserReportEntity, {
    nullable: true,
  })
  @JoinColumn({
    referencedColumnName: "id",
    name: "report_id",
  })
  report?: Relation<UserReportEntity>;

  @Column({
    name: "report_id",
    nullable: true,
  })
  reportId?: string;

  @ManyToOne(() => RulePunishmentEntity, (t) => t.punishments)
  @JoinColumn({
    referencedColumnName: "id",
    name: "punishment_id",
  })
  punishment: Relation<RulePunishmentEntity>;

  @Column({
    name: "punishment_id",
    nullable: true,
  })
  punishmentId: number;

  @Column({
    name: "reported",
  })
  reportedSteamId: string;

  @Column({
    name: "executor",
  })
  executorSteamId: string;

  constructor(
    ruleId: number,
    banDurationSeconds: number,
    reportId: string,
    punishmentId: number,
    reportedSteamId: string,
    executorSteamId: string,
  ) {
    this.ruleId = ruleId;
    this.banDurationSeconds = banDurationSeconds;
    this.reportId = reportId;
    this.punishmentId = punishmentId;
    this.reportedSteamId = reportedSteamId;
    this.executorSteamId = executorSteamId;
  }
}
