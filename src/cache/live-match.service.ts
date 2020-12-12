import { Injectable } from '@nestjs/common';
import { LiveMatchDto } from '../rest/match/dto/match.dto';
import { Subject } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
export class LiveMatchService {
  // MINUTE DELAY
  public static LIVE_DELAY = 60_000;
  // matchID key => events
  private cache = new Map<number, Subject<LiveMatchDto>>();
  private readCache = new Map<number, LiveMatchDto>();

  public pushEvent(event: LiveMatchDto) {
    if (!this.cache.has(event.matchId)) {
      // if not subject, we
      const eventStream = new Subject<LiveMatchDto>();
      this.cache.set(event.matchId, eventStream);
      eventStream
        .pipe(delay(LiveMatchService.LIVE_DELAY))
        .subscribe(lastItem => {
          this.readCache.set(event.matchId, lastItem);
        });
    }

    this.cache.get(event.matchId).next(event);
  }

  public onStop(id: number) {
    const sub = this.cache.get(id);
    if (sub) {
      sub.complete();
      this.cache.delete(id);
      this.readCache.delete(id);
    }
  }

  public list(): LiveMatchDto[] {
    return [...this.readCache.values()];
  }

  public forId(id: number): LiveMatchDto | undefined {
    return this.readCache.get(id);
  }
}
