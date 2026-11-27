import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { BanLevel, PlayerBanService } from "../service/player-ban.service";
import { CurrentUserDto } from "../utils/decorator/current-user";

export const PUBLIC_QUEUE_CHAT = "forum_17aa3530-d152-462e-a032-909ae69019ed";
export const SECRET_QUEUE_CHAT = "forum_secret-queue-chat";

export function isQueueChat(threadId: string): boolean {
  return threadId === PUBLIC_QUEUE_CHAT || threadId === SECRET_QUEUE_CHAT;
}

export async function canAccessQueueChat(
  threadId: string,
  user: CurrentUserDto | undefined,
  playerBan: PlayerBanService,
): Promise<boolean> {
  if (!isQueueChat(threadId)) return true;
  if (!user) return threadId !== SECRET_QUEUE_CHAT;
  const banned = (await playerBan.getBanStatus(user.steam_id)) !== BanLevel.NONE;
  return banned === (threadId === SECRET_QUEUE_CHAT);
}

@Injectable()
export class QueueChatStreamGuard implements CanActivate {
  constructor(private readonly playerBan: PlayerBanService) {}

  canActivate(context: ExecutionContext): Promise<boolean> {
    const { params, user } = context.switchToHttp().getRequest<{
      params: { id: string; threadType: string };
      user?: CurrentUserDto;
    }>();
    return canAccessQueueChat(`${params.threadType}_${params.id}`, user, this.playerBan);
  }
}
