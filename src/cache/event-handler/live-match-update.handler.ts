import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { LiveMatchUpdateEvent } from '../../gateway/events/gs/live-match-update.event';
import { LiveMatchService } from '../live-match.service';
import { UserRepository } from '../user/user.repository';

@EventsHandler(LiveMatchUpdateEvent)
export class LiveMatchUpdateHandler
  implements IEventHandler<LiveMatchUpdateEvent> {
  constructor(
    private readonly ls: LiveMatchService,
    private readonly uRep: UserRepository,
  ) {}

  async handle(event: LiveMatchUpdateEvent) {
    this.ls.pushEvent({
      ...event,
      heroes: await Promise.all(event.heroes.map(async h => ({
        ...h,
        name: h.bot ? '' : await this.uRep.name(h.steam_id),
      }))),
    });
  }
}
