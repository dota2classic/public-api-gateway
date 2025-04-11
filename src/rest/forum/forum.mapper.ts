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
import { UserProfileService } from "../../user-profile/service/user-profile.service";

@Injectable()
export class ForumMapper {
  constructor(
    private readonly user: UserProfileService,
    private readonly config: ConfigService,
  ) {}

  public mapEmoticon = (emo: ForumEmoticonDto): EmoticonDto => ({
    code: emo.code,
    id: emo.id,
    src: `${this.config.get("api.s3root")}/${emo.bucket}/${emo.key}`,
  });

  public mapApiMessage = async (
    msg: ForumMessageDTO,
  ): Promise<ThreadMessageDTO> => {
    return {
      messageId: msg.id,
      threadId: msg.threadId,
      content: msg.content,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
      deleted: msg.deleted,
      edited: msg.edited,
      reactions: await Promise.all(
        msg.reactions.map(async (reaction) => ({
          emoticon: this.mapEmoticon(reaction.emoticon),
          reacted: await Promise.all(reaction.reacted.map(this.user.userDto)),
        })),
      ),
      reply: msg.repliedMessage
        ? await this.mapApiMessage(msg.repliedMessage)
        : undefined,

      author: await this.user.userDto(msg.author),
    };
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
  });

  public mapUser = async (user: ForumForumUserDTO): Promise<ForumUserDto> => ({
    user: await this.user.userDto(user.steamId),
    messages: user.messages,
    mutedUntil: user.muteUntil,
  });
}
