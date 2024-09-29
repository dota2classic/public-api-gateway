import { MessageObjectDto } from '../match/dto/match.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ThreadMessageDTO {
  steamId: string;
  name: string;
  avatar: string;

  threadId: string;
  messageId: string;
  content: string;
  createdAt: string;
  index: number;
}


export class ThreadMessageSseDto extends MessageObjectDto<ThreadMessageDTO> {
  data: ThreadMessageDTO;
}
export enum ThreadType {
  MATCH = 'match',
  PROFILE = 'profile'
}



export class CreateMessageDTO {
  content: string;

  id: string;

  @ApiProperty({ enum: ThreadType, enumName: 'ThreadType' })
  threadType: ThreadType
}
