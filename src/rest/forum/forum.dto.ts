import { MessageObjectDto } from '../match/dto/match.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Page } from '../../gateway/shared-types/page';
import { UserDTO } from '../shared.dto';
import { ThreadType } from '../../gateway/shared-types/thread-type';

export class ThreadMessageDTO {
  author: UserDTO;

  threadId: string;
  messageId: string;
  content: string;
  createdAt: string;
  index: number;
}

export class ThreadDTO {
  readonly id: string;
  readonly externalId: string;
  @ApiProperty({ enum: ThreadType, enumName: 'ThreadType' })
  readonly threadType: ThreadType;
  readonly title: string;

  readonly messageCount: number;
  readonly newMessageCount: number;
  readonly views: number;

  readonly originalPoster: UserDTO;
  readonly lastMessage: ThreadMessageDTO;
}

export class ThreadPageDTO extends Page<ThreadDTO> {
  readonly data: ThreadDTO[];
  readonly page: number;
  readonly perPage: number;
  readonly pages: number;
}

export class ThreadMessageSseDto extends MessageObjectDto<ThreadMessageDTO> {
  data: ThreadMessageDTO;
}

export class CreateMessageDTO {
  content: string;

  id: string;

  @ApiProperty({ enum: ThreadType, enumName: 'ThreadType' })
  threadType: ThreadType;
}

export class CreateThreadDTO {
  title: string;

  content: string;
}
