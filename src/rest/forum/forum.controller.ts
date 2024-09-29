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
import { catchError, filter, from, Observable, withLatestFrom } from 'rxjs';
import { EventBus } from '@nestjs/cqrs';
import { MessageCreatedEvent } from '../../gateway/events/message-created.event';
import { asyncMap } from 'rxjs-async-map';
import { UserRepository } from '../../cache/user/user.repository';
import {
  CreateMessageDTO,
  ThreadMessageDTO,
  ThreadMessageSseDto,
  ThreadType,
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
import { map } from 'rxjs/operators';
import {
  Configuration as C2,
  MatchApi,
  PlayerApi,
} from '../../generated-api/gameserver';

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
    console.log('get mssages', id);
    const msgs = await this.api.forumControllerMessages(id, after, limit);

    console.log(msgs);
    return Promise.all(msgs.map(this.mapApiMessage));
  }

  @ApiParam({
    name: 'id',
    required: true,
  })
  @ApiParam({
    name: 'threadType',
    required: true,
  })
  @Sse('thread/:id/:threadType')
  thread(
    @Param('id') id: string,
    @Param('threadType') _threadType: string,
  ): Observable<ThreadMessageSseDto> {
    const t = Object.values(ThreadType).find(t => t === _threadType);
    if (!t) throw Error('Illegal argument');
    const threadType = _threadType as ThreadType;

    console.log('SSE:', id, threadType);
    const thread = from(
      this.api.forumControllerGetThreadForKey({
        externalKey: `${threadType}_${id}`,
      }),
    );

    return this.ebus.pipe(
      filter(it => it instanceof MessageCreatedEvent),
      withLatestFrom(thread),
      filter(([mce, fte]: [MessageCreatedEvent, ForumThreadDTO]) => {
        console.log('Compare', mce, fte);
        return mce.threadId === fte.id;
      }),
      map(([mce, fte]) => mce),

      asyncMap(async (mce: MessageCreatedEvent) => {
        console.log(mce.createdAt);
        const m: ThreadMessageDTO = {
          avatar: await this.urepo.avatar(mce.authorId),
          name: await this.urepo.name(mce.authorId),
          steamId: mce.authorId,

          content: mce.content,
          createdAt: mce.createdAt,
          threadId: mce.threadId,
          messageId: mce.messageId,
          index: mce.messageIndex,
        };
        return { data: m };
      }, 1),
      // @ts-ignore
      catchError(val => {
        console.log('i caught', val);
        throw 'fd';
      }),
    );
  }

  @Post('thread/message')
  @UseGuards(CustomThrottlerGuard)
  @WithUser()
  async postMessage(
    @Body() content: CreateMessageDTO,
    @CurrentUser() user: CurrentUserDto,
  ): Promise<ThreadMessageDTO> {
    console.log('post msg', content);
    const id = `${content.threadType}_${content.id}`;

    // GetOrCreate thread
    if (content.threadType === ThreadType.MATCH) {
      // make sure match exists
      await this.matchApi.matchControllerGetMatch(Number(content.id));
    } else if (content.threadType === ThreadType.PROFILE) {
      await this.playerApi.playerControllerPlayerSummary('', content.id);
    }

    return this.api
      .forumControllerPostMessage(id, {
        author: user.steam_id,
        content: content.content,
      })
      .then(r => {
        console.log(r);
        return this.mapApiMessage(r);
      });
  }

  private mapApiMessage = async (
    msg: ForumMessageDTO,
  ): Promise<ThreadMessageDTO> => ({
    messageId: msg.id,
    threadId: msg.threadId,
    content: msg.content,
    createdAt: msg.createdAt,

    avatar: await this.urepo.avatar(msg.author),
    name: await this.urepo.name(msg.author),
    steamId: msg.author,
    index: msg.index,
  });
}
