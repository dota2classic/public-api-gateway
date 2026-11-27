import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Header,
  HttpException,
  Logger,
  NotFoundException,
  Param,
  ParseBoolPipe,
  Patch,
  Post,
  Query,
  Req,
  Sse,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { catchError, exhaustMap, filter, Observable, of, takeUntil, timer } from "rxjs";
import { EventBus } from "@nestjs/cqrs";
import { makePage } from "../gateway/util/make-page";
import { asyncMap } from "rxjs-async-map";
import {
  CreateMessageDTO,
  CreateThreadDTO,
  EditMessageDto,
  EmoticonDto,
  ForumUserDto,
  SortOrder,
  ThreadDTO,
  ThreadMessageDTO,
  ThreadMessagePageDTO,
  ThreadMessageSseDto,
  ThreadPageDTO,
  UpdateMessageReactionDto,
  UpdateThreadDTO,
  UpdateUserDTO,
} from "./forum.dto";
import { ForumApi, ForumSortOrder } from "../generated-api/forum";
import { NullableIntPipe, PagePipe, PerPagePipe } from "../utils/pipes";
import {
  AdminGuard,
  ModeratorGuard,
  WithUser,
} from "../utils/decorator/with-user";
import {
  CurrentUser,
  CurrentUserDto,
} from "../utils/decorator/current-user";
import { CustomThrottlerGuard } from "../strategy/custom-throttler.guard";
import { ApiClient } from "@dota2classic/gs-api-generated/dist/module";
import { ThreadType } from "../gateway/shared-types/thread-type";
import { randomUUID } from "crypto";
import { MessageUpdatedEvent } from "../gateway/events/message-updated.event";
import { ForumMapper } from "./forum.mapper";
import { WithPagination } from "../utils/decorator/pagination";
import { PlayerId } from "../gateway/shared-types/player-id";
import { WithOptionalUser } from "../utils/decorator/with-optional-user";
import { BlogpostEntity } from "../database/entities/blogpost.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CacheTTL } from "@nestjs/cache-manager";
import { AiService } from "../service/ai.service";
import { Throttle } from "@nestjs/throttler";

import { PlayerBanService } from "../service/player-ban.service";
import { canAccessQueueChat, isQueueChat, QueueChatStreamGuard, SECRET_QUEUE_CHAT } from "./queue-chat";

@Controller("forum")
@ApiTags("forum")
export class ForumController {
  private readonly logger = new Logger(ForumController.name);

  constructor(
    private readonly ebus: EventBus,
    private readonly mapper: ForumMapper,
    private readonly api: ForumApi,
    private readonly gsApi: ApiClient,
    @InjectRepository(BlogpostEntity)
    private readonly blogpostEntityRepository: Repository<BlogpostEntity>,
    private readonly feedbackAssistant: AiService,
    private readonly playerBan: PlayerBanService,
  ) {}

  @ApiParam({
    name: "id",
    type: "string",
    required: true,
  })
  @ApiParam({
    name: "threadType",
    required: false,
    enum: ThreadType,
    enumName: "ThreadType",
  })
  @ApiQuery({
    name: "cursor",
    type: "string",
    required: false,
  })
  @ApiQuery({
    name: "limit",
    type: "number",
    required: false,
  })
  @ApiQuery({
    name: "order",
    enum: SortOrder,
    enumName: "SortOrder",
    required: false,
  })
  @WithOptionalUser()
  @Header("Cache-Control", "private, no-store")
  @Get("thread/:id/:threadType/messages")
  async getMessages(
    @Param("id") _id: string,
    @Param("threadType") threadType: ThreadType,
    @Query("cursor") cursor: string,
    @Query("limit", NullableIntPipe) limit: number = 10,
    @Query("order") order: SortOrder = SortOrder.ASC,
    @CurrentUser() user?: CurrentUserDto,
  ): Promise<ThreadMessageDTO[]> {
    this.assertCommentsVisible(threadType, user);
    const id = `${threadType}_${_id}`;
    await this.assertQueueChatAccess(id, user);
    try {
      const msgs = await this.api.forumControllerMessages(
        id,
        cursor,
        limit,
        order as unknown as ForumSortOrder,
      );
      return Promise.all(
        msgs.map((msg) => this.mapper.mapApiMessage(msg, user)),
      );
    } catch (e) {
      return Promise.resolve([]);
    }
  }

  @ApiParam({
    name: "id",
    required: true,
  })
  @ApiQuery({
    name: "perPage",
    required: false,
  })
  @ApiParam({
    name: "threadType",
    required: false,
    enum: ThreadType,
    enumName: "ThreadType",
  })
  @WithOptionalUser()
  @Header("Cache-Control", "private, no-store")
  @Get("thread/:id/:threadType/latestPage")
  async getLatestPage(
    @Param("id") id: string,
    @Param("threadType") threadType: ThreadType,
    @Query("perPage", NullableIntPipe) perPage: number = 15,
    @CurrentUser() user?: CurrentUserDto,
  ): Promise<ThreadMessagePageDTO> {
    this.assertCommentsVisible(threadType, user);
    await this.assertQueueChatAccess(`${threadType}_${id}`, user);
    const pg = await this.api.forumControllerGetLatestPage(
      `${threadType}_${id}`,
      perPage,
    );

    return await makePage(
      pg.data,
      pg.pages * pg.perPage,
      pg.page,
      pg.perPage,
      (msg) => this.mapper.mapApiMessage(msg, user),
      pg.cursor,
    );
  }

  @ApiParam({
    name: "id",
    required: true,
  })
  @ApiQuery({
    name: "cursor",
    required: false,
    type: "string",
  })
  @ApiParam({
    name: "threadType",
    required: false,
    enum: ThreadType,
    enumName: "ThreadType",
  })
  @WithPagination()
  @WithOptionalUser()
  @Header("Cache-Control", "private, no-store")
  @Get("thread/:id/:threadType/page")
  async messagesPage(
    @Param("id") id: string,
    @Param("threadType") threadType: ThreadType,
    @Query("page", PagePipe) page: number,
    @Query("cursor") cursor?: string,
    @Query("per_page", new PerPagePipe(15)) perPage: number = 15,
    @CurrentUser() user?: CurrentUserDto,
  ): Promise<ThreadMessagePageDTO> {
    this.assertCommentsVisible(threadType, user);
    await this.assertQueueChatAccess(`${threadType}_${id}`, user);
    const pg = await this.api.forumControllerMessagesPage(
      `${threadType}_${id}`,
      page,
      cursor,
      perPage,
    );

    return await makePage(
      pg.data,
      pg.pages * pg.perPage,
      pg.page,
      pg.perPage,
      (msg) => this.mapper.mapApiMessage(msg, user),
    );
  }

  @WithPagination()
  @ApiQuery({
    name: "threadType",
    required: false,
    enum: ThreadType,
    enumName: "ThreadType",
  })
  @ApiQuery({
    name: "only_authored",
    required: true,
    type: Boolean,
  })
  @WithOptionalUser()
  @Get("threads")
  @CacheTTL(15)
  async threads(
    @Req() req: any,
    @Query("page", PagePipe) page: number,
    @Query("per_page", new PerPagePipe()) perPage: number,
    @Query("threadType") threadType?: ThreadType,
    @Query("only_authored", ParseBoolPipe) onlyAuthored: boolean = false,
    @CurrentUser() u?: CurrentUserDto,
  ): Promise<ThreadPageDTO> {
    const threads = await this.api.forumControllerThreads(
      page,
      onlyAuthored ? u?.steam_id : undefined,
      perPage,
      threadType,
    );

    return {
      data: await Promise.all(threads.data.map(this.mapper.mapThread)),
      page: threads.page,
      perPage: threads.perPage,
      pages: threads.pages,
    };
  }

  @ApiParam({
    name: "id",
    required: true,
  })
  @ApiParam({
    name: "threadType",
    required: false,
    enum: ThreadType,
    enumName: "ThreadType",
  })
  @WithOptionalUser()
  @Header("Cache-Control", "private, no-store")
  @Get("thread/:id/:threadType")
  async getThread(
    @Param("id") id: string,
    @Param("threadType") threadType: ThreadType,
    @CurrentUser() user?: CurrentUserDto,
  ) {
    await this.assertQueueChatAccess(`${threadType}_${id}`, user);
    if (
      threadType === ThreadType.FORUM ||
      threadType === ThreadType.TICKET ||
      threadType == ThreadType.REPORT
    ) {
      return this.api
        .forumControllerGetThread(`${threadType}_${id}`)
        .then(this.mapper.mapThread);
    } else if (threadType === ThreadType.BLOGPOST) {
      await this.blogpostEntityRepository.findOneOrFail({
        where: {
          id: Number(id),
          published: true,
        },
      });
      return this.api
        .forumControllerGetThreadForKey({
          threadType: ThreadType.BLOGPOST,
          externalId: id,
          title: `Пост ${id}`,
          op: undefined, // Make player author of its own thread
        })
        .then(this.mapper.mapThread);
    } else if (threadType === ThreadType.LOBBY) {
      return this.api
        .forumControllerGetThreadForKey({
          threadType: ThreadType.LOBBY,
          externalId: id,
          title: `Лобби ${id}`,
          op: undefined, // Make player author of its own thread
        })
        .then(this.mapper.mapThread);
    } else if (threadType === ThreadType.PLAYER) {
      try {
        // Check if its valid
        new PlayerId(id);
        return this.api
          .forumControllerGetThreadForKey({
            threadType: ThreadType.PLAYER,
            externalId: id,
            title: `Игрок ${id}`,
            op: undefined, // Make player author of its own thread
          })
          .then(this.mapper.mapThread);
      } catch (e) {
        throw new NotFoundException("Thread not found");
      }
    } else if (threadType === ThreadType.MATCH) {
      try {
        // Live or finished
        const matchId = parseInt(id);
        const matchRes = await this.gsApi.match.matchControllerGetMatch(matchId);
        if (matchRes.data)
          return this.api
            .forumControllerGetThreadForKey({
              threadType: ThreadType.MATCH,
              externalId: id,
              title: `Матч ${matchId}`,
              op: undefined, // A little harder here, who is op? Should there be an op?
            })
            .then(this.mapper.mapThread);
      } catch (e) {
        throw new NotFoundException("Match not found");
      }
    } else {
      throw new BadRequestException(`Unknown thread type: ${threadType}`);
    }
  }

  @ApiParam({
    name: "id",
    required: true,
  })
  @ApiParam({
    name: "threadType",
    required: false,
    enum: ThreadType,
    enumName: "ThreadType",
  })
  @UseGuards(QueueChatStreamGuard)
  @WithOptionalUser()
  @Sse("thread/:id/:threadType/sse")
  thread(
    @Param("id") id: string,
    @Param("threadType") threadType: ThreadType,
    @CurrentUser() user?: CurrentUserDto,
  ): Observable<ThreadMessageSseDto> {
    this.assertCommentsVisible(threadType, user);
    const externalThreadId = `${threadType}_${id}`;

    const updates = this.ebus.pipe(
      filter((it) => it instanceof MessageUpdatedEvent),
      filter((mce: MessageUpdatedEvent) => mce.threadId === externalThreadId),
      asyncMap(async (mce: MessageUpdatedEvent) => {
        if (externalThreadId === SECRET_QUEUE_CHAT) {
          await this.assertQueueChatAccess(externalThreadId, user);
        }
        return { data: await this.mapper.mapApiMessage(mce, user) };
      }, 1),
    );

    if (!user || !isQueueChat(externalThreadId)) return updates;
    const accessRevoked = timer(15_000, 15_000).pipe(
      exhaustMap(() => canAccessQueueChat(externalThreadId, user, this.playerBan)),
      catchError(() => of(false)),
      filter((allowed) => !allowed),
    );
    return updates.pipe(takeUntil(accessRevoked));
  }

  @Patch("thread/message/:id")
  @UseGuards(CustomThrottlerGuard)
  @WithUser()
  async editMessage(
    @Param("id") id: string,
    @Body() content: EditMessageDto,
    @CurrentUser() user: CurrentUserDto,
  ): Promise<ThreadMessageDTO> {
    await this.getAccessibleMessage(id, user);
    try {
      return await this.api
        .forumControllerEditMessage(id, {
          content: content.content,
          author: user,
        })
        .then((msg) => this.mapper.mapApiMessage(msg, user));
    } catch (response) {
      throw new HttpException("Muted", response.status);
    }
  }

  @UseGuards(CustomThrottlerGuard)
  @WithOptionalUser()
  @Header("Cache-Control", "private, no-store")
  @Get("thread/message/:id")
  async getMessage(
    @Param("id") id: string,
    @CurrentUser() user?: CurrentUserDto,
  ): Promise<ThreadMessageDTO> {
    const message = await this.getAccessibleMessage(id, user);
    return this.mapper.mapApiMessage(message, user);
  }

  @Post("thread/message")
  @UseGuards(CustomThrottlerGuard)
  @WithUser()
  async postMessage(
    @Body() content: CreateMessageDTO,
    @CurrentUser() user: CurrentUserDto,
  ): Promise<ThreadMessageDTO> {
    await this.assertQueueChatAccess(content.threadId, user);
    try {
      return await this.api
        .forumControllerPostMessage(content.threadId, {
          author: user,
          content: content.content,
          replyMessageId: content.replyMessageId,
        })
        .then((msg) => this.mapper.mapApiMessage(msg, user));
    } catch (response) {
      throw new HttpException("Muted", response.status);
    }
  }

  @Post("thread")
  @UseGuards(CustomThrottlerGuard)
  @WithUser()
  async createThread(
    @Body() content: CreateThreadDTO,
    @CurrentUser() user: CurrentUserDto,
  ): Promise<ThreadDTO> {
    const validation = await this.feedbackAssistant.getValidationResult(
      content.title + "\n\n" + content.content,
    );
    if (validation.invalid) {
      this.logger.log(
        "Thread didn't complete validation! Reason: " + validation.reason,
      );
      throw new HttpException(
        { message: "Пост не прошел проверку подерации" },
        400,
      );
    }

    this.logger.log("Creating valid thread", validation);

    const thread = await this.api.forumControllerGetThreadForKey({
      threadType: content.threadType,
      externalId: randomUUID(),
      title: content.title,
      op: user.steam_id,
    });
    const message = await this.api.forumControllerPostMessage(thread.id, {
      content: content.content,
      author: user,
    });

    return this.mapper.mapThread({
      ...thread,
      originalPoster: message.author,
      lastMessage: message,
    });
  }

  @Delete("thread/message/:id")
  @ModeratorGuard()
  @WithUser()
  async deleteMessage(
    @Param("id") id: string,
    @CurrentUser() user: CurrentUserDto,
  ): Promise<ThreadMessageDTO> {
    await this.getAccessibleMessage(id, user);
    return this.api
      .forumControllerDeleteMessage(id)
      .then(this.mapper.mapApiMessage);
  }

  @Patch("thread/:id")
  @AdminGuard()
  @WithUser()
  async updateThread(
    @Param("id") id: string,
    @Body() dto: UpdateThreadDTO,
    @CurrentUser() user: CurrentUserDto,
  ): Promise<ThreadDTO> {
    await this.assertQueueChatAccess(id, user);
    return this.api
      .forumControllerUpdateThread(id, dto)
      .then(this.mapper.mapThread);
  }

  @Patch("user/:id")
  @ModeratorGuard()
  @WithUser()
  async updateUser(
    @Param("id") steamId: string,
    @Body() dto: UpdateUserDTO,
  ): Promise<number> {
    try {
      const response = await this.api
        .forumControllerUpdateUser(steamId, dto)
        .catch((e) => {
          console.error("HEy", e);
        });

      console.log("eee", response);
    } catch (g) {
      console.error("GGG", g);
    }
    return 200;
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @UseGuards(CustomThrottlerGuard)
  @Post("thread/message/:id/react")
  @WithUser()
  async react(
    @Param("id") messageId: string,
    @Body() content: UpdateMessageReactionDto,
    @CurrentUser() user: CurrentUserDto,
  ): Promise<ThreadMessageDTO> {
    await this.getAccessibleMessage(messageId, user);
    try {
      return await this.api
        .forumControllerToggleReaction(messageId, {
          emoticonId: content.emoticonId,
          author: user.steam_id,
        })
        .then((msg) => this.mapper.mapApiMessage(msg, user));
    } catch (response) {
      throw new HttpException("Muted", response.status);
    }
  }

  @Post("thread/message/:id/pin")
  @ModeratorGuard()
  @WithUser()
  async pinMessage(
    @Param("id") messageId: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    await this.getAccessibleMessage(messageId, user);
    try {
      return await this.api.forumControllerPinMessage(messageId);
    } catch (response) {
      throw new HttpException("Muted", response.status);
    }
  }

  @ApiQuery({
    type: "string",
    required: false,
    name: "steam_id",
  })
  @Get("emoticons")
  public emoticons(
    @Query("steam_id") steamId?: string,
  ): Promise<EmoticonDto[]> {
    return this.api
      .forumControllerAllEmoticons(steamId)
      .then((emoticons) => emoticons.map(this.mapper.mapEmoticon));
  }

  @Get("user/:id")
  @ModeratorGuard()
  @WithUser()
  public async getUser(@Param("id") steamId: string): Promise<ForumUserDto> {
    const user = await this.api.forumControllerGetUser(steamId);

    return this.mapper.mapUser(user);
  }

  private async assertQueueChatAccess(threadId: string, user?: CurrentUserDto) {
    if (!(await canAccessQueueChat(threadId, user, this.playerBan))) {
      throw new ForbiddenException("Этот чат вам недоступен");
    }
  }

  private async getAccessibleMessage(id: string, user?: CurrentUserDto) {
    const message = await this.api.forumControllerGetMessage(id).catch((response) => {
      throw new HttpException("Message unavailable", response?.status || 502);
    });
    await this.assertQueueChatAccess(message.threadId, user);
    return message;
  }

  // Player profile comments and news comments are hidden from guests —
  // everything else (forum, tickets, lobby/match chat) stays public.
  private assertCommentsVisible(
    threadType: ThreadType,
    user: CurrentUserDto | undefined,
  ) {
    const gatedForGuests =
      threadType === ThreadType.PLAYER || threadType === ThreadType.BLOGPOST;
    if (gatedForGuests && !user) {
      throw new UnauthorizedException(
        "Войдите, чтобы посмотреть комментарии",
      );
    }
  }
}
