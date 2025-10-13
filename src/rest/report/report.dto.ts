import { UserDTO } from "../shared.dto";
import { RuleDto, RulePunishmentDto } from "../rule/rule.dto";
import { ThreadMessageDTO } from "../forum/forum.dto";
import { Page } from "../../gateway/shared-types/page";

export class ReportPlayerInMatchDto {
  steamId: string;
  matchId: number;
  ruleId: number;
  comment: string;
}

export class ReportMessageDto {
  steamId: string;
  messageId: string;
  ruleId: number;
  comment: string;
}

export class ReportDto {
  id: string;
  reported: UserDTO;
  reporter: UserDTO;
  rule: RuleDto;
  handled: boolean;
  createdAt: string;
  matchId?: number;
  message?: ThreadMessageDTO;
}

export class HandleReportDto {
  valid: boolean;
  overridePunishmentId?: number;
}

export class PunishmentLogDto {
  id: number;
  createdAt: string;
  reported: UserDTO;
  executor: UserDTO;
  duration: number;
  reportId?: string;
  rule: RuleDto;
  punishment: RulePunishmentDto;
}

export class PunishmentLogPageDto extends Page<PunishmentLogDto> {
  data: PunishmentLogDto[];
  page: number;
  perPage: number;
  pages: number;
}

export class ReportPageDto extends Page<ReportDto> {
  data: ReportDto[];
  page: number;
  perPage: number;
  pages: number;
}

export class ApplyPunishmentDto {
  steamId: string;
  ruleId: number;
  overridePunishmentId?: number;
}
