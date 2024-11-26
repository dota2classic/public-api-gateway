import { EventsHandler, IEventHandler, QueryBus } from "@nestjs/cqrs";
import { QueueUpdatedEvent } from "../../gateway/events/queue-updated.event";
import { GetQueueStateQuery } from "../../gateway/queries/QueueState/get-queue-state.query";
import { GetQueueStateQueryResult } from "../../gateway/queries/QueueState/get-queue-state-query.result";
import { inspect } from "util";
import { SocketDelivery } from "../socket-delivery";
import { MessageTypeS2C } from "../messages/s2c/message-type.s2c";
import { QueueStateMessageS2C } from "../messages/s2c/queue-state-message.s2c";

@EventsHandler(QueueUpdatedEvent)
export class QueueUpdatedHandler implements IEventHandler<QueueUpdatedEvent> {
  constructor(
    private readonly qbus: QueryBus,
    private readonly delivery: SocketDelivery,
  ) {}

  async handle(event: QueueUpdatedEvent) {
    try {
      const qs: GetQueueStateQueryResult = await this.qbus.execute(
        new GetQueueStateQuery(event.mode, event.version),
      );

      const inQueue = qs.entries
        .map((t) => t.players.length)
        .reduce((a, b) => a + b, 0);

      await this.delivery.broadcastAll(
        MessageTypeS2C.QUEUE_STATE,
        new QueueStateMessageS2C(event.mode, event.version, inQueue),
      );
    } catch (e) {
      console.log(inspect(e));
    }
  }
}
