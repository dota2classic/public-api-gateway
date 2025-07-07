import { RmqContext } from "@nestjs/microservices";
import { Controller, Logger } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ConfigService } from "@nestjs/config";
import { PlayerFeedbackCreatedEvent } from "./gateway/events/player-feedback-created.event";
import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { MessageUpdatedEvent } from "./gateway/events/message-updated.event";
import { TicketMessageHandler } from "./rest/notification/event-handler/ticket-message-handler.service";
import { PlayerNotLoadedEvent } from "./gateway/events/bans/player-not-loaded.event";
import { PlayerNotLoadedHandler } from "./rest/feedback/event-handler/player-not-loaded.handler";
import { PlayerFeedbackCreatedHandler } from "./rest/notification/event-handler/player-feedback-created.handler";
import { FeedbackCreatedEvent } from "./rest/feedback/event/feedback-created.event";
import { FeedbackCreatedHandler } from "./rest/notification/event-handler/feedback-created.handler";

@Controller()
export class RmqController {
  private readonly logger = new Logger(RmqController.name);

  constructor(
    private readonly cbus: CommandBus,
    private readonly ticketMessageHandler: TicketMessageHandler,
    private readonly playerNotLoadedHandler: PlayerNotLoadedHandler,
    private readonly playerFeedbackCreatedHandler: PlayerFeedbackCreatedHandler,
    private readonly feedbackCreatedHandler: FeedbackCreatedHandler,
    private readonly config: ConfigService,
  ) {}

  @RabbitSubscribe({
    exchange: "app.events",
    routingKey: FeedbackCreatedEvent.name,
    queue: `api-queue.${FeedbackCreatedEvent.name}`,
  })
  async FeedbackCreatedEvent(data: FeedbackCreatedEvent) {
    await this.feedbackCreatedHandler.handle(data);
  }

  @RabbitSubscribe({
    exchange: "app.events",
    routingKey: PlayerFeedbackCreatedEvent.name,
    queue: `api-queue.${PlayerFeedbackCreatedEvent.name}`,
  })
  async PlayerFeedbackCreatedEvent(data: PlayerFeedbackCreatedEvent) {
    await this.playerFeedbackCreatedHandler.handle(data);
  }

  @RabbitSubscribe({
    exchange: "app.events",
    routingKey: PlayerNotLoadedEvent.name,
    queue: `api-queue.${PlayerNotLoadedEvent.name}`,
  })
  private async createFeedbackForNotLoading(msg: PlayerNotLoadedEvent) {
    await this.playerNotLoadedHandler.handle(msg);
  }

  @RabbitSubscribe({
    exchange: "app.events",
    routingKey: MessageUpdatedEvent.name,
    queue: `api-queue.${MessageUpdatedEvent.name}`,
  })
  private async createTicketMessageNotification(msg: MessageUpdatedEvent) {
    await this.ticketMessageHandler.handle(msg);
  }

  private async processMessage<T>(msg: T, context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    return Promise.resolve(msg)
      .then((cmd) => this.cbus.execute(cmd))
      .then(() => channel.ack(originalMsg))
      .catch((e) => {
        this.logger.error(`Error while processing message`, e);
        channel.nack(originalMsg);
      });
  }
}
