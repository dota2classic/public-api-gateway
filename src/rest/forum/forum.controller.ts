import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { filter, Observable } from 'rxjs';
import { EventBus } from '@nestjs/cqrs';
import { MessageCreatedEvent } from '../../gateway/events/message-created.event';
import { asyncMap } from 'rxjs-async-map';
import { UserRepository } from '../../cache/user/user.repository';
import {
  CreateMessageDTO,
  CreateThreadDTO,
  ThreadDTO,
  ThreadMessageDTO,
  ThreadMessageSseDto,
  ThreadPageDTO,
} from './forum.dto';
import {
  Configuration,
  ForumApi,
  ForumMessageDTO,
  ForumThreadDTO,
} from '../../generated-api/forum';
import { FORUM_APIURL, GAMESERVER_APIURL } from '../../utils/env';
import { NullableIntPipe } from '../../utils/pipes';
import { WithUser } from '../../utils/decorator/with-user';
import {
  CurrentUser,
  CurrentUserDto,
} from '../../utils/decorator/current-user';
import { CustomThrottlerGuard } from '../strategy/custom-throttler.guard';
import {
  Configuration as C2,
  MatchApi,
  PlayerApi,
} from '../../generated-api/gameserver';
import { ThreadType } from '../../gateway/shared-types/thread-type';
import { randomUUID } from 'crypto';

@Controller('forum')
@ApiTags('forum')
export class ForumController {
  private api: ForumApi;
  private matchApi: MatchApi;
  private playerApi: PlayerApi;

  constructor(
    private readonly ebus: EventBus,
    private readonly urepo: UserRepository,
  ) {
    this.api = new ForumApi(
      new Configuration({ basePath: `http://${FORUM_APIURL}` }),
    );
    this.matchApi = new MatchApi(
      new C2({ basePath: `http://${GAMESERVER_APIURL}` }),
    );
    this.playerApi = new PlayerApi(
      new C2({ basePath: `http://${GAMESERVER_APIURL}` }),
    );
  }

  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
  })
  @ApiParam({
    name: 'threadType',
    required: true,
  })
  @ApiQuery({
    name: 'after',
    type: 'number',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
  })
  @Get('thread/:id/:threadType/messages')
  async getMessages(
    @Param('id') _id: string,
    @Param('threadType') _threadType: string,
    @Query('after', NullableIntPipe) after?: number,
    @Query('limit', NullableIntPipe) limit: number = 10,
  ): Promise<ThreadMessageDTO[]> {
    const t = Object.values(ThreadType).find(t => t === _threadType);
    if (!t) throw Error('Illegal argument');
    const threadType = _threadType as ThreadType;
    const id = `${threadType}_${_id}`;
    const msgs = await this.api.forumControllerMessages(id, after, limit);
    return Promise.all(msgs.map(this.mapApiMessage));
  }

  @ApiQuery({
    name: 'page',
    required: true,
  })
  @ApiQuery({
    name: 'perPage',
    required: false,
  })
  @Get('threads')
  async threads(
    @Query('page', NullableIntPipe) page: number,
    @Query('perPage', NullableIntPipe) perPage: number = 25,
  ): Promise<ThreadPageDTO> {
    const threads = await this.api.forumControllerThreads(page, perPage);

    return {
      data: await Promise.all(threads.data.map(this.mapThread)),
      page: threads.page,
      perPage: threads.perPage,
      pages: threads.pages,
    };
  }

  @ApiParam({
    name: 'id',
    required: true,
  })
  @ApiParam({
    name: 'threadType',
    required: true,
  })
  @Get('thread/:id/:threadType')
  getThread(@Param('id') id: string, @Param('threadType') _threadType: string) {
    return this.api
      .forumControllerGetThread(`${_threadType}_${id}`)
      .then(this.mapThread);
  }

  @ApiParam({
    name: 'id',
    required: true,
  })
  @ApiParam({
    name: 'threadType',
    required: true,
  })
  @Sse('thread/:id/:threadType/sse')
  thread(
    @Param('id') id: string,
    @Param('threadType') _threadType: string,
  ): Observable<ThreadMessageSseDto> {
    const t = Object.values(ThreadType).find(t => t === _threadType);
    if (!t) throw Error('Illegal argument');
    const threadType = _threadType as ThreadType;

    const externalThreadId = `${threadType}_${id}`;

    return this.ebus.pipe(
      filter(it => it instanceof MessageCreatedEvent),
      filter((mce: MessageCreatedEvent) => mce.threadId === externalThreadId),
      asyncMap(async (mce: MessageCreatedEvent) => {
        const m: ThreadMessageDTO = {
          author: await this.urepo.userDto(mce.authorId),

          content: mce.content,
          createdAt: mce.createdAt,
          threadId: mce.threadId,
          messageId: mce.messageId,
          index: mce.messageIndex,
        };
        return { data: m };
      }, 1),
    );
  }

  @Post('thread/message')
  @UseGuards(CustomThrottlerGuard)
  @WithUser()
  async postMessage(
    @Body() content: CreateMessageDTO,
    @CurrentUser() user: CurrentUserDto,
  ): Promise<ThreadMessageDTO> {
    // GetOrCreate thread
    if (content.threadType === ThreadType.MATCH) {
      // make sure match exists
      await this.matchApi.matchControllerGetMatch(Number(content.id));
    } else if (content.threadType === ThreadType.PLAYER) {
      await this.playerApi.playerControllerPlayerSummary(
        'Dota_684',
        content.id,
      );
    }

    const thread = await this.api.forumControllerGetThreadForKey({
      threadType: content.threadType,
      externalId: content.id,
      title: `${content.threadType === ThreadType.MATCH ? 'Матч' : 'Профиль'} ${
        content.id
      }`,
    });

    return this.api
      .forumControllerPostMessage(thread.id, {
        author: user.steam_id,
        content: content.content,
      })
      .then(this.mapApiMessage);
  }

  @Post('thread')
  @UseGuards(CustomThrottlerGuard)
  @WithUser()
  async createThread(
    @Body() content: CreateThreadDTO,
    @CurrentUser() user: CurrentUserDto,
  ): Promise<ThreadDTO> {
    return this.api
      .forumControllerGetThreadForKey({
        threadType: ThreadType.FORUM,
        externalId: randomUUID(),
        title: content.title,
        opMessage: {
          content: content.content,
          author: user.steam_id,
        },
      })
      .then(this.mapThread);
  }

  private mapApiMessage = async (
    msg?: ForumMessageDTO,
  ): Promise<ThreadMessageDTO | undefined> => {
    if (!msg) return undefined;
    return {
      messageId: msg.id,
      threadId: msg.threadId,
      content: msg.content,
      createdAt: msg.createdAt,
      index: msg.index,

      author: await this.urepo.userDto(msg.author),
    };
  };

  private mapThread = async (thread: ForumThreadDTO): Promise<ThreadDTO> => ({
    id: thread.id,
    externalId: thread.externalId,
    threadType: thread.threadType,
    title: thread.title,

    views: thread.views,
    messageCount: thread.messageCount,
    newMessageCount: thread.newMessageCount,

    originalPoster: await this.urepo.userDto(thread.originalPoster),
    lastMessage: await this.mapApiMessage(thread.lastMessage),
  });
}
