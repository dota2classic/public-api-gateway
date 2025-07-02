import { EventBus, EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { LobbyUpdatedEvent } from "../event/lobby-updated.event";
import { PartyInvalidatedEvent } from "../../../socket/event/party-invalidated.event";

@EventsHandler(LobbyUpdatedEvent)
export class LobbyUpdatedHandler implements IEventHandler<LobbyUpdatedEvent> {
  constructor(private readonly ebus: EventBus) {}

  async handle(event: LobbyUpdatedEvent) {
    this.ebus.publishAll(
      event.lobbyEntity.slots.map(
        (slot) => new PartyInvalidatedEvent(slot.steamId),
      ),
    );
  }
}
