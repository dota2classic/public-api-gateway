import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from "@nestjs/microservices";
import { Controller, Logger } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ConfigService } from "@nestjs/config";
import { PlayerFeedbackCreatedEvent } from "./gateway/events/player-feedback-created.event";
import { CreateFeedbackNotificationCommand } from "./rest/notification/command-handler/CreateFeebackNotification/create-feedback-notification.command";
import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { MessageUpdatedEvent } from "./gateway/events/message-updated.event";
import { TicketMessageHandler } from "./rest/notification/event-handler/ticket-message-handler.service";

@Controller()
export class RmqController {
  private readonly logger = new Logger(RmqController.name);

  constructor(
    private readonly cbus: CommandBus,
    private readonly ticketMessageHandler: TicketMessageHandler,
    private readonly config: ConfigService,
  ) {}

  @MessagePattern("RMQ" + PlayerFeedbackCreatedEvent.name)
  async PlayerFeedbackCreatedEvent(
    @Payload() data: PlayerFeedbackCreatedEvent,
    @Ctx() context: RmqContext,
  ) {
    await this.processMessage(
      new CreateFeedbackNotificationCommand(
        data.receiverSteamId,
        data.aspect,
        data.matchId,
      ),
      context,
    );
  }

  @RabbitSubscribe({
    exchange: "forum_message_exchange",
    routingKey: MessageUpdatedEvent.name,
    queue: "api-queue",
  })
  private async createTicketMessageNotification(msg: MessageUpdatedEvent) {
    console.log("Handling poop");
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
