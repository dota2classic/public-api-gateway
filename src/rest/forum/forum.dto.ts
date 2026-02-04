import { MessageObjectDto } from "../match/dto/match.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Page } from "../../gateway/shared-types/page";
import { UserDTO } from "../shared.dto";
import { ThreadType } from "../../gateway/shared-types/thread-type";
import { IsEnum, IsIn, MinLength } from "class-validator";

export class EmoticonDto {
  id: number;
  code: string;

  src: string;
}

export class ReactionEntry {
  emoticon: EmoticonDto;
  reacted: UserDTO[];
}

export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}

export class ThreadMessageDTO {
  author: UserDTO;
  blocked: boolean;

  threadId: string;
  messageId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  edited: boolean;
  reactions: ReactionEntry[];

  reply?: ThreadMessageDTO;
}

export class ThreadMessagePageDTO extends Page<ThreadMessageDTO, string> {
  readonly data: ThreadMessageDTO[];
  readonly page: number;
  readonly perPage: number;
  readonly pages: number;
  readonly cursor?: string;
}

export class ThreadDTO {
  readonly id: string;
  readonly externalId: string;
  @ApiProperty({ enum: ThreadType, enumName: "ThreadType" })
  readonly threadType: ThreadType;
  readonly title: string;

  readonly messageCount: number;
  readonly newMessageCount: number;
  readonly views: number;
  readonly pinned: boolean;
  readonly adminOnly: boolean;

  readonly originalPoster?: UserDTO;
  readonly lastMessage?: ThreadMessageDTO;
  readonly pinnedMessage?: ThreadMessageDTO;
}

export class ThreadPageDTO extends Page<ThreadDTO, string> {
  readonly data: ThreadDTO[];
  readonly page: number;
  readonly perPage: number;
  readonly pages: number;
  readonly cursor?: string;
}

export class ThreadMessageSseDto extends MessageObjectDto<ThreadMessageDTO> {
  data: ThreadMessageDTO;
}

export class CreateMessageDTO {
  @MinLength(1)
  content: string;

  threadId: string;

  replyMessageId?: string;
}

export class EditMessageDto {
  @MinLength(1)
  content: string;
}

export class CreateThreadDTO {
  @MinLength(5)
  title: string;

  @MinLength(5)
  content: string;

  @IsEnum(ThreadType)
  @IsIn([ThreadType.FORUM, ThreadType.TICKET])
  @ApiProperty({ enum: ThreadType, enumName: "ThreadType" })
  threadType: ThreadType;
}

export class UpdateThreadDTO {
  pinned: boolean;
}

export class UpdateUserDTO {
  muteUntil: string;
}

export class ForumUserDto {
  user: UserDTO;
  mutedUntil: string;
  messages: number;
}

export class UpdateMessageReactionDto {
  emoticonId: number;
}
