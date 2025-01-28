import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PlayerAbandonedEvent } from "../../../gateway/events/bans/player-abandoned.event";

@EventsHandler(PlayerAbandonedEvent)
export class PlayerAbandonedHandler
  implements IEventHandler<PlayerAbandonedEvent>
{
  constructor() {}

  async handle(event: PlayerAbandonedEvent) {}
}
