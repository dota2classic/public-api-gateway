import { Injectable, Logger } from "@nestjs/common";
import { LiveMatchDto } from "../rest/match/dto/match.dto";
import { concat, Observable, of, Subject } from "rxjs";
import { delay } from "rxjs/operators";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class LiveMatchService {
  // MINUTE DELAY
  // matchID key => events
  private cache = new Map<number, Subject<LiveMatchDto>>();
  private finishedMatchesCache = new Map<number, boolean>();

  private readonly entityCache = new Map<number, LiveMatchDto>();
  private readonly logger = new Logger(LiveMatchService.name);
  private readonly delay: number;

  constructor(private readonly config: ConfigService) {
    this.delay = config.get<number>("api.liveMatchDelay");
    this.logger.log(`Using delay of ${this.delay} for live previews`);
  }

  private isMatchComplete(id: number): boolean {
    return this.finishedMatchesCache.get(id) === true;
  }

  public pushEvent(event: LiveMatchDto) {
    this.logger.verbose(
      `Pushing event ${event.matchId} ${this.isMatchComplete(event.matchId)}`,
    );
    if (this.isMatchComplete(event.matchId)) return;

    if (!this.cache.has(event.matchId)) {
      // if not subject, we
      const eventStream = new Subject<LiveMatchDto>();
      this.cache.set(event.matchId, eventStream);

      eventStream.pipe(delay(this.delay)).subscribe((e) => {
        this.entityCache.set(e.matchId, e);
      });
    }

    this.cache.get(event.matchId).next(event);
  }

  public onStop(id: number) {
    const sub = this.cache.get(id);
    if (sub) {
      sub.complete();
      this.cache.delete(id);
      this.finishedMatchesCache.set(id, true);
      this.entityCache.delete(id);
    }
  }

  public list(): LiveMatchDto[] {
    return [...this.entityCache.values()].filter(
      (t) => !this.isMatchComplete(t.matchId),
    );
  }

  public streamMatch(id: number): Observable<LiveMatchDto> {
    const liveOne = this.cache.get(id);

    if (liveOne && !this.isMatchComplete(id)) {
      return concat(of(this.entityCache.get(id)), liveOne).pipe(
        delay(this.delay),
      );
    }

    return of();
  }
}
