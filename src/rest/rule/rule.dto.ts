export class RuleDto {
  id: string;
  index: number;
  description: string;
  parentId?: number;
  children: RuleDto[];
}


export class CreateRuleDto {
  parent?: number;
}

export class UpdateRuleIndexDto {
  ruleId: number;
  parent?: number | null
  index?: number;
}

export class UpdateRuleIndicesDto {
  updates: UpdateRuleIndexDto[]
}


export class UpdateRuleDto {
  parent?: number | null
  description?: string;
  index?: number;
}


export class RuleDeleteResultDto {
  success: boolean;
  message: string;
}
