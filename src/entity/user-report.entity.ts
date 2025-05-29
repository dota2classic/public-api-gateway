import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { RuleEntity } from "./rule.entity";

@Entity("user_report")
@Check("message_id is not null or match_id is not null")
export class UserReportEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    name: "reporter_steam_id",
  })
  reporterSteamId: string;

  @Column({
    name: "reported_steam_id",
  })
  reportedSteamId: string;

  @ManyToOne(() => RuleEntity, (t) => t.reports, { eager: true })
  @JoinColumn({
    referencedColumnName: "id",
    name: "rule_id",
  })
  rule: Relation<RuleEntity>;

  @Column({
    name: "rule_id",
  })
  ruleId: number;

  @Column({
    name: "match_id",
    nullable: true,
  })
  matchId?: number;

  @Column({
    name: "message_id",
    nullable: true,
  })
  messageId?: string;

  @Column({
    name: "comment",
    default: "",
  })
  comment: string;

  constructor(
    reporterSteamId: string,
    reportedSteamId: string,
    ruleId: number,
    comment: string,
    matchId?: number,
  ) {
    this.reporterSteamId = reporterSteamId;
    this.reportedSteamId = reportedSteamId;
    this.ruleId = ruleId;
    this.matchId = matchId;
    this.comment = comment;
  }
}
