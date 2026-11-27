import { ForbiddenException } from "@nestjs/common";
import { Subject } from "rxjs";
import { ForumController } from "./forum.controller";
import { PUBLIC_QUEUE_CHAT, SECRET_QUEUE_CHAT } from "./queue-chat";
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
    return { controller, storage, message };
  }

  it("protects direct message reads and stream subscriptions", async () => {
    const { controller, message } = setup();
    await expect(controller.getMessage("id")).rejects.toBeInstanceOf(ForbiddenException);
    await expect(controller.getMessage("id", unbanned)).rejects.toBeInstanceOf(ForbiddenException);
    await expect(controller.getMessage("id", banned)).resolves.toBe(message);
    await expect(controller.thread("secret-queue-chat", ThreadType.FORUM, unbanned))
      .rejects.toBeInstanceOf(ForbiddenException);
    await expect(controller.thread("secret-queue-chat", ThreadType.FORUM, banned))
      .resolves.toHaveProperty("subscribe");
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
