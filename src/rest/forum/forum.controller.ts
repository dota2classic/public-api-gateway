import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Sse,
  UseGuards,
} from "@nestjs/common";
import { ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { filter, Observable } from "rxjs";
import { EventBus } from "@nestjs/cqrs";
import { MessageCreatedEvent } from "../../gateway/events/message-created.event";
import { makePage } from "../../gateway/util/make-page";
import { asyncMap } from "rxjs-async-map";
import { UserRepository } from "../../cache/user/user.repository";
import {
  CreateMessageDTO,
  CreateThreadDTO,
  SortOrder,
  ThreadDTO,
  ThreadMessageDTO,
  ThreadMessagePageDTO,
  ThreadMessageSseDto,
  ThreadPageDTO,
  UpdateThreadDTO,
  UpdateUserDTO,
} from "./forum.dto";
import {
  Configuration,
  ForumApi,
  ForumSortOrder,
} from "../../generated-api/forum";
import { FORUM_APIURL, GAMESERVER_APIURL } from "../../utils/env";
import { NullableIntPipe } from "../../utils/pipes";
import { AdminGuard, WithUser } from "../../utils/decorator/with-user";
import {
  CurrentUser,
  CurrentUserDto,
} from "../../utils/decorator/current-user";
import { CustomThrottlerGuard } from "../strategy/custom-throttler.guard";
import {
  Configuration as C2,
  MatchApi,
  PlayerApi,
} from "../../generated-api/gameserver";
import { ThreadType } from "../../gateway/shared-types/thread-type";
import { randomUUID } from "crypto";
import { MessageUpdatedEvent } from "../../gateway/events/message-updated.event";
import { ForumMapper } from "./forum.mapper";
import { WithPagination } from "../../utils/decorator/pagination";

@Controller("forum")
@ApiTags("forum")
export class ForumController {
  private api: ForumApi;
  private matchApi: MatchApi;
  private playerApi: PlayerApi;

  constructor(
    private readonly ebus: EventBus,
    private readonly mapper: ForumMapper,
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
    name: "after",
    type: "number",
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
  @Get("thread/:id/:threadType/messages")
  async getMessages(
    @Param("id") _id: string,
    @Param("threadType") threadType: ThreadType,
    @Query("after", NullableIntPipe) after?: number,
    @Query("limit", NullableIntPipe) limit: number = 10,
    @Query("order") order: SortOrder = SortOrder.ASC,
  ): Promise<ThreadMessageDTO[]> {
    const id = `${threadType}_${_id}`;
    const msgs = await this.api.forumControllerMessages(
      id,
      after,
      limit,
      order as unknown as ForumSortOrder,
    );
    return Promise.all(msgs.map(this.mapper.mapApiMessage));
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
  @WithPagination()
  @Get("thread/:id/:threadType/page")
  async messagesPage(
    @Param("id") id: string,
    @Param("threadType") threadType: ThreadType,
    @Query("page", NullableIntPipe) page: number,
    @Query("per_page", NullableIntPipe) perPage: number = 15,
  ): Promise<ThreadMessagePageDTO> {
    const pg = await this.api.forumControllerMessagesPage(
      `${threadType}_${id}`,
      page,
      perPage,
    );

    return await makePage(
      pg.data,
      pg.pages * pg.perPage,
      pg.page,
      pg.perPage,
      this.mapper.mapApiMessage,
    );
  }

  @WithPagination()
  @ApiQuery({
    name: "threadType",
    required: false,
    enum: ThreadType,
    enumName: "ThreadType",
  })
  @Get("threads")
  async threads(
    @Req() req: any,
    @Query("page", NullableIntPipe) page: number,
    @Query("per_page", NullableIntPipe) perPage: number = 25,
    @Query("threadType") threadType?: ThreadType,
  ): Promise<ThreadPageDTO> {
    const threads = await this.api.forumControllerThreads(
      page,
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
  @Get("thread/:id/:threadType")
  getThread(
    @Param("id") id: string,
    @Param("threadType") threadType: ThreadType,
  ) {
    return this.api
      .forumControllerGetThread(`${threadType}_${id}`)
      .then(this.mapper.mapThread);
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
  @Sse("thread/:id/:threadType/sse")
  thread(
    @Param("id") id: string,
    @Param("threadType") threadType: ThreadType,
  ): Observable<ThreadMessageSseDto> {
    const externalThreadId = `${threadType}_${id}`;

    return this.ebus.pipe(
      filter(
        (it) =>
          it instanceof MessageCreatedEvent ||
          it instanceof MessageUpdatedEvent,
      ),
      filter(
        (mce: MessageCreatedEvent | MessageUpdatedEvent) =>
          mce.threadId === externalThreadId,
      ),
      asyncMap(async (mce: MessageCreatedEvent | MessageUpdatedEvent) => {
        const m: ThreadMessageDTO = {
          author: await this.urepo.userDto(mce.authorId),

          content: mce.content,
          createdAt: mce.createdAt,
          threadId: mce.threadId,
          deleted: "deleted" in mce ? mce.deleted : false,
          messageId: mce.messageId,
          index: mce.messageIndex,
        };
        return { data: m };
      }, 1),
    );
  }

  @Post("thread/message")
  @UseGuards(CustomThrottlerGuard)
  @WithUser()
  async postMessage(
    @Body() content: CreateMessageDTO,
    @CurrentUser() user: CurrentUserDto,
  ): Promise<ThreadMessageDTO> {
    try {
      return await this.api
        .forumControllerPostMessage(`forum_${content.threadId}`, {
          author: user,
          content: content.content,
        })
        .then(this.mapper.mapApiMessage);
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
    const thread = await this.api.forumControllerGetThreadForKey({
      threadType: ThreadType.FORUM,
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
  @AdminGuard()
  @WithUser()
  async deleteMessage(@Param("id") id: string): Promise<ThreadMessageDTO> {
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
  ): Promise<ThreadDTO> {
    return this.api
      .forumControllerUpdateThread(id, dto)
      .then(this.mapper.mapThread);
  }

  @Patch("user/:id")
  @AdminGuard()
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
}
