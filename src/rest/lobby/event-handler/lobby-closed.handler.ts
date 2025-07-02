import { EventBus, EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PartyInvalidatedEvent } from "../../../socket/event/party-invalidated.event";
import { LobbyClosedEvent } from "../event/lobby-closed.event";

@EventsHandler(LobbyClosedEvent)
export class LobbyClosedHandler implements IEventHandler<LobbyClosedEvent> {
  constructor(private readonly ebus: EventBus) {}

  async handle(event: LobbyClosedEvent) {
    this.ebus.publishAll(
      event.affectedSteamId.map(
        (steamId) => new PartyInvalidatedEvent(steamId),
      ),
    );
  }
}
