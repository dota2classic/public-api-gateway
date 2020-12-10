import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { LiveMatchUpdateEvent } from '../../gateway/events/gs/live-match-update.event';
import { LiveMatchService } from '../live-match.service';

@EventsHandler(LiveMatchUpdateEvent)
export class LiveMatchUpdateHandler
  implements IEventHandler<LiveMatchUpdateEvent> {
  constructor(private readonly ls: LiveMatchService) {}

  async handle(event: LiveMatchUpdateEvent) {
    console.log("Yeah")
    this.ls.cache.set(event.matchId, event);
  }
}
