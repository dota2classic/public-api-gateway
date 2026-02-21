import { Injectable } from "@nestjs/common";
import {
  ForumEmoticonDto,
  ForumForumUserDTO,
  ForumMessageDTO,
  ForumThreadDTO,
} from "../../generated-api/forum";
import {
  EmoticonDto,
  ForumUserDto,
  ThreadDTO,
  ThreadMessageDTO,
} from "./forum.dto";
import { ConfigService } from "@nestjs/config";
import { UserProfileService } from "../../service/user-profile.service";
import { UserRelationService } from "../../service/user-relation.service";
import { UserRelationStatus } from "../../gateway/shared-types/user-relation";
import { CurrentUserDto } from "../../utils/decorator/current-user";
import { isOld } from "../../utils/is-old";

@Injectable()
export class ForumMapper {
  constructor(
    private readonly user: UserProfileService,
    private readonly config: ConfigService,
    private readonly userRelation: UserRelationService,
  ) {}

  public mapApiMessage = async (
    msg: ForumMessageDTO,
    mapFor?: CurrentUserDto,
  ): Promise<ThreadMessageDTO> => {
    const [blocked, reactions, reply, author] = await Promise.combine([
      this.isBlockedMessage(msg, mapFor),
      Promise.all(
        msg.reactions.map(async (reaction) => ({
          emoticon: this.mapEmoticon(reaction.emoticon),
          reacted: [],
          reactedCount: reaction.reacted.length,
          myReaction: reaction.reacted.includes(mapFor?.steam_id),
        })),
      ),
      msg.repliedMessage
        ? this.mapApiMessage(msg.repliedMessage)
        : Promise.resolve(undefined),
      this.user.userDto(msg.author),
    ]);

    return {
      messageId: msg.id,
      blocked: blocked,
      threadId: msg.threadId,
      content: msg.content,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
      deleted: msg.deleted,
      edited: msg.edited,
      reactions: reactions,
      reply: reply,

      author: author,
    };
  };

  public mapEmoticon = (emo: ForumEmoticonDto): EmoticonDto => ({
    code: emo.code,
    id: emo.id,
    src: `${this.config.get("api.s3root")}/${emo.bucket}/${emo.key}`,
  });

  private isBlockedMessage = async (
    msg: ForumMessageDTO,
    mapFor?: CurrentUserDto,
  ): Promise<boolean> => {
    if (!mapFor || !isOld(mapFor.roles)) return false;
    return mapFor
      ? (await this.userRelation.getRelationSync(
          mapFor.steam_id,
          msg.author,
        )) === UserRelationStatus.BLOCK
      : false;
  };

  public mapThread = async (thread: ForumThreadDTO): Promise<ThreadDTO> => ({
    id: thread.id,
    externalId: thread.externalId,
    threadType: thread.threadType,
    title: thread.title,

    views: thread.views,
    pinned: thread.pinned,
    adminOnly: thread.adminOnly,
    messageCount: thread.messageCount,
    newMessageCount: thread.newMessageCount,

    originalPoster:
      thread.originalPoster && (await this.user.userDto(thread.originalPoster)),
    lastMessage:
      thread.lastMessage && (await this.mapApiMessage(thread.lastMessage)),
    pinnedMessage:
      thread.pinnedMessage && (await this.mapApiMessage(thread.pinnedMessage)),
  });

  public mapUser = async (user: ForumForumUserDTO): Promise<ForumUserDto> => ({
    user: await this.user.userDto(user.steamId),
    messages: user.messages,
    mutedUntil: user.muteUntil,
  });
}
