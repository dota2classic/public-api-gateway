import { EventBus, EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { LobbyUpdatedEvent } from "../event/lobby-updated.event";
import { PartyInvalidatedEvent } from "../../../socket/event/party-invalidated.event";

@EventsHandler(LobbyUpdatedEvent)
export class LobbyUpdatedHandler implements IEventHandler<LobbyUpdatedEvent> {
  constructor(private readonly ebus: EventBus) {}

  async handle(event: LobbyUpdatedEvent) {
    console.log("LobbyUpdatedEvent");
    console.log(event);
    this.ebus.publishAll(
      event.affectedSteamId.map((slot) => new PartyInvalidatedEvent(slot)),
    );
  }
}
