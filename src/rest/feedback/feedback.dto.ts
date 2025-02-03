import { UserDTO } from "../shared.dto";
import { Page } from "../../gateway/shared-types/page";

export class FeedbackOptionDto {
  id: number;
  option: string;
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
  option: string;
  checked: boolean;
}

export class SubmitFeedbackDto {
  comment?: string;
  options: SubmittedFeedbackOptionDto[];

  createTicket: boolean;
}

export class UpdateFeedbackDto {
  tag: string;
  title: string;
}

export class CreateFeedbackDto {
  tag: string;
  title: string;
}

export class CreateFeedbackOptionDto {
  option: string;
}

export class FeedbackTemplateOptionDto {
  id: number;
  option: string;
}

export class FeedbackTemplateDto {
  id: number;
  tag: string;
  title: string;
  options: FeedbackTemplateOptionDto[];
}

export class PlayerFeedbackDto {
  id: number;
  user: UserDTO;
  title: string;
  comment: string;
  options: SubmittedFeedbackOptionDto[];
}

export class PlayerFeedbackPageDto extends Page<PlayerFeedbackDto> {
  page: number;
  pages: number;
  perPage: number;
  data: PlayerFeedbackDto[];
}
