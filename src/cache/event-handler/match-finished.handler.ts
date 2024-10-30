import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { MatchFinishedEvent } from '../../gateway/events/match-finished.event';
import { LiveMatchService } from '../live-match.service';

@EventsHandler(MatchFinishedEvent)
export class MatchFinishedHandler implements IEventHandler<MatchFinishedEvent> {
  constructor(private readonly ls: LiveMatchService) {}

  async handle(event: MatchFinishedEvent) {
    this.ls.onStop(event.matchId);
  }
}
