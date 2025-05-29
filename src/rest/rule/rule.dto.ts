import { IsInt, IsPositive } from "class-validator";

export class RuleDto {
  id: string;
  index: number;
  title: string;
  description: string;
  parentId?: number;
  children: RuleDto[];
  punishment?: RulePunishmentDto;
}

export class RulePunishmentDto {
  id: number;
  title: string;
  durationHours: number;
}

export class CreateRuleDto {
  parent?: number;
}

export class UpdateRuleIndexDto {
  ruleId: number;
  parent?: number | null;
  index?: number;
}

export class UpdateRuleIndicesDto {
  updates: UpdateRuleIndexDto[];
}

export class UpdateRuleDto {
  parent?: number | null;
  title?: string;
  description?: string;
  punishmentId?: number | null;
  index?: number;
}

export class UpdatePunishmentDto {
  title?: string;

  @IsInt()
  @IsPositive()
  durationHours?: number;
}

export class RuleDeleteResultDto {
  success: boolean;
  message: string;
}

export class PrettyRuleDto {
  id: number;
  fullIndex: string;
  title: string;
  description: string;
  punishment?: RulePunishmentDto;
}
