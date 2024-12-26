import { Injectable } from "@nestjs/common";
import {
  ForumForumUserDTO,
  ForumMessageDTO,
  ForumThreadDTO,
} from "../../generated-api/forum";
import { ForumUserDto, ThreadDTO, ThreadMessageDTO } from "./forum.dto";
import { UserRepository } from "../../cache/user/user.repository";

@Injectable()
export class ForumMapper {
  constructor(private readonly urepo: UserRepository) {}

  public mapApiMessage = async (
    msg: ForumMessageDTO,
  ): Promise<ThreadMessageDTO> => {
    return {
      messageId: msg.id,
      threadId: msg.threadId,
      content: msg.content,
      createdAt: msg.createdAt,
      deleted: msg.deleted,

      author: await this.urepo.userDto(msg.author),
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
      thread.originalPoster &&
      (await this.urepo.userDto(thread.originalPoster)),
    lastMessage:
      thread.lastMessage && (await this.mapApiMessage(thread.lastMessage)),
  });

  public mapUser = async (user: ForumForumUserDTO): Promise<ForumUserDto> => ({
    user: await this.urepo.userDto(user.steamId),
    messages: user.messages,
    mutedUntil: user.muteUntil,
  });
}
