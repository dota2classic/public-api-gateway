import { Injectable, Logger } from '@nestjs/common';
import { LiveMatchDto } from '../rest/match/dto/match.dto';
import { concat, Observable, of, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { LIVE_MATCH_DELAY } from '../utils/env';

@Injectable()
export class LiveMatchService {
  // MINUTE DELAY
  // matchID key => events
  private cache = new Map<number, Subject<LiveMatchDto>>();

  private readonly entityCache = new Map<number, LiveMatchDto>();
  private readonly logger = new Logger(LiveMatchService.name);

  constructor() {
    this.logger.log(`Using delay of ${LIVE_MATCH_DELAY} for live previews`);
  }

  public pushEvent(event: LiveMatchDto) {
    if (!this.cache.has(event.matchId)) {
      // if not subject, we
      const eventStream = new Subject<LiveMatchDto>();
      this.cache.set(event.matchId, eventStream);

      eventStream.pipe(delay(LIVE_MATCH_DELAY)).subscribe(e => {
        this.entityCache.set(e.matchId, e);
      });
    }

    const str = this.cache.get(event.matchId);
    if (!str.isStopped) this.cache.get(event.matchId).next(event);
  }

  public onStop(id: number) {
    const sub = this.cache.get(id);
    if (sub) {
      sub.complete();
      // this.cache.delete(id);
      this.entityCache.delete(id);
    }
  }

  public list(): LiveMatchDto[] {
    return [...this.entityCache.values()];
  }

  public streamMatch(id: number): Observable<LiveMatchDto> {
    const liveOne = this.cache.get(id);

    if (liveOne && !liveOne.isStopped) {
      return concat(
        of(this.entityCache.get(id)),
        liveOne, //.pipe(delay(LIVE_MATCH_DELAY)),
      );
    }

    return of();
  }
}
