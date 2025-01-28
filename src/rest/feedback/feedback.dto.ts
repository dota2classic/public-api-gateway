export class FeedbackOptionDto {
  id: number;
  name: string;
  checked: boolean;
}
export class FeedbackDto {
  id: number;
  title: string;
  finished: boolean;
  comment: string;
  options: FeedbackOptionDto[];
}

export class SubmittedFeedbackOptionDto {
  id: number;
  checked: boolean;
}

export class SubmitFeedbackDto {
  comment?: string;
  options: SubmittedFeedbackOptionDto[];
}
