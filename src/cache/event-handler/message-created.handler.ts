import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { MessageCreatedEvent } from "../message-created.event";
import { Inject, Logger } from "@nestjs/common";
import Redis from "ioredis";
import { ForumApi } from "../../generated-api/forum";

@EventsHandler(MessageCreatedEvent)
export class MessageCreatedHandler
  implements IEventHandler<MessageCreatedEvent>
{
  private static PROMO_MESSAGE_SPAN = 25;
  private static PROMO_MESSAGE_SPAN_KEY = "promo_message_span_counter";
  // Rotated every PROMO_MESSAGE_SPAN messages so the two promos don't land
  // on top of each other.
  private static PROMO_MESSAGES = [
    `Подписывайся на наш телеграм канал! https://t.me/dota2classicru - мемы, новости проекта, интересная статистика и другие интересные посты!`,
    `Если вы хотите приобрести итемы по лучшим ценам и поддержать DotaClassic - покупайте на сайте наших партнеров Collector's Shop: https://collectorsshop.ru/promo/old - промокод OLD даёт 7% скидки!`,
  ];
  private logger = new Logger(MessageCreatedHandler.name);

  constructor(
    @Inject("REDIS") private readonly redis: Redis,
    private readonly forumApi: ForumApi,
  ) {}

  async handle(event: MessageCreatedEvent) {
    if (event.event.deleted) return;
    // Increment and get counter in redis
    const counter = await this.redis.incr(
      MessageCreatedHandler.PROMO_MESSAGE_SPAN_KEY,
    );
    if (counter % MessageCreatedHandler.PROMO_MESSAGE_SPAN === 0) {
      // Reset to 0
      await this.redis.set(MessageCreatedHandler.PROMO_MESSAGE_SPAN_KEY, 0);

      const round = counter / MessageCreatedHandler.PROMO_MESSAGE_SPAN;
      const content =
        MessageCreatedHandler.PROMO_MESSAGES[
          round % MessageCreatedHandler.PROMO_MESSAGES.length
        ];
      await this.postMessage(content);
    }
  }

  private async postMessage(content: string) {
    try {
      // Send a message to all chat
      await this.forumApi.forumControllerPostMessage(
        "forum_17aa3530-d152-462e-a032-909ae69019ed",
        {
          content,
          author: {
            steam_id: "159907143",
            roles: [],
          },
        },
      );
    } catch (e) {
      this.logger.warn("There was an issue sending a promo message", e);
    }
  }
}
