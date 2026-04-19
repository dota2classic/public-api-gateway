import { LiveMatchService } from "./live-match.service";
import { ConfigService } from "@nestjs/config";
import { LiveMatchDto } from "../match/dto/match.dto";

const DELAY = 5000;

function makeService(delay = DELAY): LiveMatchService {
  const config = { get: jest.fn().mockReturnValue(delay) } as unknown as ConfigService;
  return new LiveMatchService(config);
}

function makeEvent(matchId: number, duration = 0): LiveMatchDto {
  return { matchId, duration } as LiveMatchDto;
}

// Fake-timer suite — tests the mechanism
describe("LiveMatchService (fake timers)", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  describe("pushEvent delay", () => {
    it("does not update list() before delay fires", async () => {
      const svc = makeService();
      svc.pushEvent(makeEvent(1));
      expect(svc.list()).toHaveLength(0);
    });

    it("updates list() after delay fires", async () => {
      const svc = makeService();
      const push = svc.pushEvent(makeEvent(1));
      jest.advanceTimersByTime(DELAY);
      await push;
      expect(svc.list()).toHaveLength(1);
      expect(svc.list()[0].matchId).toBe(1);
    });

    it("each subsequent event is also delayed", async () => {
      const svc = makeService();

      const p1 = svc.pushEvent(makeEvent(1, 10));
      jest.advanceTimersByTime(DELAY);
      await p1;
      expect(svc.list()[0].duration).toBe(10);

      const p2 = svc.pushEvent(makeEvent(1, 20));
      expect(svc.list()[0].duration).toBe(10); // old value still

      jest.advanceTimersByTime(DELAY);
      await p2;
      expect(svc.list()[0].duration).toBe(20);
    });
  });

  describe("onStop delay", () => {
    it("keeps match in list() immediately after onStop", async () => {
      const svc = makeService();
      const push = svc.pushEvent(makeEvent(1));
      jest.advanceTimersByTime(DELAY);
      await push;

      svc.onStop(1);
      expect(svc.list()).toHaveLength(1);
    });

    it("removes match from list() after delay passes", async () => {
      const svc = makeService();
      const push = svc.pushEvent(makeEvent(1));
      jest.advanceTimersByTime(DELAY);
      await push;

      svc.onStop(1);
      jest.advanceTimersByTime(DELAY);
      expect(svc.list()).toHaveLength(0);
    });

    it("discards new incoming events immediately after onStop", async () => {
      const svc = makeService();
      const p1 = svc.pushEvent(makeEvent(1, 10));
      jest.advanceTimersByTime(DELAY);
      await p1;

      svc.onStop(1);

      const p2 = svc.pushEvent(makeEvent(1, 999));
      jest.advanceTimersByTime(DELAY - 1);
      await p2;

      expect(svc.list()[0].duration).toBe(10);
    });
  });

  describe("streamMatch", () => {
    it("emits current snapshot then delayed updates", async () => {
      const svc = makeService();

      const p1 = svc.pushEvent(makeEvent(1, 10));
      jest.advanceTimersByTime(DELAY);
      await p1;

      const received: LiveMatchDto[] = [];
      const sub = svc.streamMatch(1).subscribe((e) => {
        if (e) received.push(e);
      });

      expect(received).toHaveLength(1);
      expect(received[0].duration).toBe(10);

      const p2 = svc.pushEvent(makeEvent(1, 20));
      jest.advanceTimersByTime(DELAY);
      await p2;

      expect(received).toHaveLength(2);
      expect(received[1].duration).toBe(20);

      sub.unsubscribe();
    });
  });
});

// Real-timer suite — catches delay=0/NaN bugs that fake timers hide
describe("LiveMatchService (real timers)", () => {
  const SHORT_DELAY = 100;

  it("list() is empty for the full delay duration, then populates", async () => {
    const svc = makeService(SHORT_DELAY);
    svc.pushEvent(makeEvent(1, 42));

    // Before delay — must be empty
    expect(svc.list()).toHaveLength(0);

    // Halfway through — still empty
    await new Promise((r) => setTimeout(r, SHORT_DELAY / 2));
    expect(svc.list()).toHaveLength(0);

    // After delay — must be populated
    await new Promise((r) => setTimeout(r, SHORT_DELAY));
    expect(svc.list()).toHaveLength(1);
    expect(svc.list()[0].duration).toBe(42);
  });

  it("SSE stream does not emit event before delay", async () => {
    const svc = makeService(SHORT_DELAY);

    // Seed the cache with a prior event so streamMatch returns a live observable
    const seed = svc.pushEvent(makeEvent(1, 1));
    await new Promise((r) => setTimeout(r, SHORT_DELAY + 10));
    await seed;

    const received: LiveMatchDto[] = [];
    const sub = svc.streamMatch(1).subscribe((e) => {
      if (e) received.push(e);
    });
    // Snapshot arrives immediately (that's correct — it's the already-delayed state)
    expect(received).toHaveLength(1);

    // New event — must NOT appear before delay
    svc.pushEvent(makeEvent(1, 99));
    await new Promise((r) => setTimeout(r, SHORT_DELAY / 2));
    expect(received).toHaveLength(1); // still only the snapshot

    // After delay — the new event arrives
    await new Promise((r) => setTimeout(r, SHORT_DELAY));
    expect(received).toHaveLength(2);
    expect(received[1].duration).toBe(99);

    sub.unsubscribe();
  });
});
