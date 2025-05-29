
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
