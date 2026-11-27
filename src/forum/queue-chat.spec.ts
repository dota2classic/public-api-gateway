import { ForbiddenException } from "@nestjs/common";
import { Subject } from "rxjs";
import { ForumController } from "./forum.controller";
import { PUBLIC_QUEUE_CHAT, QueueChatStreamGuard, SECRET_QUEUE_CHAT } from "./queue-chat";
import { ThreadType } from "../gateway/shared-types/thread-type";
import { BanLevel } from "../service/player-ban.service";

describe("SECRET queue chat", () => {
  const banned = { steam_id: "1", roles: [] };
  const unbanned = { steam_id: "2", roles: [] };

  function setup() {
    const message = { threadId: SECRET_QUEUE_CHAT };
    const storage = {
      forumControllerGetMessage: jest.fn().mockResolvedValue(message),
      forumControllerPostMessage: jest.fn().mockResolvedValue(message),
    };
    const mapper = { mapApiMessage: jest.fn((value) => value) };
    const bans = {
      getBanStatus: jest.fn(async (id: string) =>
        id === banned.steam_id ? BanLevel.PERMANENT : BanLevel.NONE,
      ),
    };
    const controller = new ForumController(
      new Subject() as any, mapper as any, storage as any, {} as any,
      {} as any, {} as any, bans as any,
    );
    return { controller, storage, message, guard: new QueueChatStreamGuard(bans as any) };
  }

  it("protects direct message reads and stream subscriptions", async () => {
    const { controller, guard, message } = setup();
    await expect(controller.getMessage("id")).rejects.toBeInstanceOf(ForbiddenException);
    await expect(controller.getMessage("id", unbanned)).rejects.toBeInstanceOf(ForbiddenException);
    await expect(controller.getMessage("id", banned)).resolves.toBe(message);
    const context = (user: typeof banned) => ({
      switchToHttp: () => ({
        getRequest: () => ({ params: { id: "secret-queue-chat", threadType: ThreadType.FORUM }, user }),
      }),
    }) as any;
    await expect(guard.canActivate(context(unbanned))).resolves.toBe(false);
    await expect(guard.canActivate(context(banned))).resolves.toBe(true);
    expect(controller.thread("secret-queue-chat", ThreadType.FORUM, banned))
      .toHaveProperty("subscribe");
  });

  it("authorizes writes using the actual target thread", async () => {
    const { controller, storage } = setup();
    const request = { threadId: SECRET_QUEUE_CHAT, content: "test" };
    await expect(controller.postMessage(request, unbanned)).rejects.toBeInstanceOf(ForbiddenException);
    await expect(controller.postMessage({ ...request, threadId: PUBLIC_QUEUE_CHAT }, banned))
      .rejects.toBeInstanceOf(ForbiddenException);
    expect(storage.forumControllerPostMessage).not.toHaveBeenCalled();
    await controller.postMessage(request, banned);
    expect(storage.forumControllerPostMessage).toHaveBeenCalledWith(
      SECRET_QUEUE_CHAT, expect.objectContaining({ author: banned }),
    );
  });
});
