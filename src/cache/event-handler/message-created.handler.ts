import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { MessageCreatedEvent } from "../message-created.event";
import { Inject, Logger } from "@nestjs/common";
import Redis from "ioredis";
import { ForumApi } from "../../generated-api/forum";

@EventsHandler(MessageCreatedEvent)
export class MessageCreatedHandler
  implements IEventHandler<MessageCreatedEvent>
{
  private static TELEGRAM_MESSAGE_SPAN = 50;
  private static TELEGRAM_MESSAGE_SPAN_KEY = "telegram_message_span_counter";
  private logger = new Logger(MessageCreatedHandler.name);

  constructor(
    @Inject("REDIS") private readonly redis: Redis,
    private readonly forumApi: ForumApi,
  ) {}

  async handle(event: MessageCreatedEvent) {
    // Increment and get counter in redis
    const counter = await this.redis.incr(
      MessageCreatedHandler.TELEGRAM_MESSAGE_SPAN_KEY,
    );
    if (counter % MessageCreatedHandler.TELEGRAM_MESSAGE_SPAN === 0) {
      // Reset to 0
      await this.redis.set(MessageCreatedHandler.TELEGRAM_MESSAGE_SPAN_KEY, 0);

      // Do your custom action
      await this.postMessage();
    }
  }

  private async postMessage() {
    try {
      // Send a message to all chat
      await this.forumApi.forumControllerPostMessage(
        "forum_17aa3530-d152-462e-a032-909ae69019ed",
        {
          content: `Подписывайся на наш телеграм канал! https://t.me/dota2classicru - мемы, новости проекта, интересная статистика и другие интересные посты!`,
          author: {
            steam_id: "159907143",
            roles: [],
          },
        },
      );
    } catch (e) {
      this.logger.warn(
        "There wa an issue sending message about telegram stuff",
        e,
      );
    }
  }
}
