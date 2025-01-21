import { EventsHandler, IEventHandler, QueryBus } from "@nestjs/cqrs";
import { QueueUpdatedEvent } from "../../gateway/events/queue-updated.event";
import { inspect } from "util";
import { SocketDelivery } from "../socket-delivery";
import { MessageTypeS2C } from "../messages/s2c/message-type.s2c";
import { QueueStateMessageS2C } from "../messages/s2c/queue-state-message.s2c";
import { Dota2Version } from "../../gateway/shared-types/dota2version";
import { MatchmakingModes } from "../../gateway/shared-types/matchmaking-mode";

@EventsHandler(QueueUpdatedEvent)
export class QueueUpdatedHandler implements IEventHandler<QueueUpdatedEvent> {
  constructor(
    private readonly qbus: QueryBus,
    private readonly delivery: SocketDelivery,
  ) {}

  async handle(event: QueueUpdatedEvent) {
    try {
      await Promise.all(
        MatchmakingModes.map((mode) =>
          this.delivery.broadcastAll(
            MessageTypeS2C.QUEUE_STATE,
            new QueueStateMessageS2C(
              mode,
              Dota2Version.Dota_684,
              event.modes.find((mapping) => mapping.lobby === mode)?.count || 0,
            ),
          ),
        ),
      );
      // await Promise.all(
      //   event.modes.map((mode) =>
      //     this.delivery.broadcastAll(
      //       MessageTypeS2C.QUEUE_STATE,
      //       new QueueStateMessageS2C(
      //         mode.lobby,
      //         Dota2Version.Dota_684,
      //         mode.count,
      //       ),
      //     ),
      //   ),
      // );
    } catch (e) {
      console.log(inspect(e));
    }
  }
}
