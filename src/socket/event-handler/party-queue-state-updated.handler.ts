import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PartyQueueStateUpdatedEvent } from "../../gateway/events/mm/party-queue-state-updated.event";
import { SocketDelivery } from "../socket-delivery";

@EventsHandler(PartyQueueStateUpdatedEvent)
export class PartyQueueStateUpdatedHandler
  implements IEventHandler<PartyQueueStateUpdatedEvent>
{
  constructor(private readonly delivery: SocketDelivery) {}

  async handle(event: PartyQueueStateUpdatedEvent) {
    // const affected = event.entries.map((it) => it.value);
    //
    // const evt: PlayerQueueStateMessageS2C | undefined = event.queueState
    //   ? new PlayerQueueStateMessageS2C(
    //       event.queueState.mode,
    //       event.queueState.version,
    //     )
    //   : undefined;
    //
    // await this.delivery.broadcastAuthorized(affected, () => [
    //   MessageTypeS2C.PLAYER_QUEUE_STATE,
    //   evt,
    // ]);
  }
}
