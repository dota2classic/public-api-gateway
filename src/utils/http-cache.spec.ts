import { CallHandler, Controller, ExecutionContext, Get } from "@nestjs/common";
import { APP_INTERCEPTOR, Reflector } from "@nestjs/core";
import { CacheTTL } from "@nestjs/cache-manager";
import { Test } from "@nestjs/testing";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { lastValueFrom, Observable } from "rxjs";
import { CacheShared, HttpCacheInterceptor } from "./http-cache";
import { RedisCacheStore } from "../core/redis-cache.store";

class Routes {
  @CacheTTL(10)
  scoped() {}

  @CacheTTL(10)
  @CacheShared()
  shared() {}

  uncached() {}
}

const memoryStore = () => {
  const data = new Map<string, string>();
  return {
    data,
    getRaw: async (key: string) => data.get(key),
    setRaw: async (key: string, raw: string) => {
      data.set(key, raw);
    },
  };
};

const contextOf = (handler: () => void, url: string, steamId?: string, method = "GET") =>
  ({
    getType: () => "http",
    getHandler: () => handler,
    getClass: () => Routes,
    switchToHttp: () => ({
      getRequest: () => ({ method, url, user: steamId ? { steam_id: steamId } : undefined }),
      getResponse: () => ({ header: () => undefined }),
    }),
  }) as unknown as ExecutionContext;

const handlerReturning = (produce: () => Promise<unknown>) => {
  const handle = jest.fn(
    () => new Observable((sub) => void produce().then((v) => (sub.next(v), sub.complete()))),
  );
  return { handle } as CallHandler & { handle: jest.Mock };
};

const run = async (
  interceptor: HttpCacheInterceptor,
  ctx: ExecutionContext,
  next: CallHandler,
) => lastValueFrom(await interceptor.intercept(ctx, next));

describe("HttpCacheInterceptor", () => {
  const routes = new Routes();
  let store: ReturnType<typeof memoryStore>;
  let interceptor: HttpCacheInterceptor;

  beforeEach(() => {
    store = memoryStore();
    interceptor = new HttpCacheInterceptor(store, new Reflector());
  });

  it("keeps user-scoped responses apart per user", async () => {
    const next = handlerReturning(async () => "a");
    await run(interceptor, contextOf(routes.scoped, "/x", "1"), next);
    await run(interceptor, contextOf(routes.scoped, "/x", "2"), next);
    await run(interceptor, contextOf(routes.scoped, "/x", "1"), next);

    expect(next.handle).toHaveBeenCalledTimes(2);
    expect([...store.data.keys()].sort()).toEqual(["http:/x:1", "http:/x:2"]);
  });

  it("shares one entry and one handler call across users for shared routes", async () => {
    const next = handlerReturning(() => new Promise((r) => setTimeout(() => r("s"), 10)));
    const results = await Promise.all(
      ["1", "2", undefined].map((id) => run(interceptor, contextOf(routes.shared, "/s", id), next)),
    );

    expect(results).toEqual(["s", "s", "s"]);
    expect(next.handle).toHaveBeenCalledTimes(1);
    expect([...store.data.keys()]).toEqual(["http:/s"]);
  });

  it("does not store nil or cache routes without a TTL or non-GET requests", async () => {
    const next = handlerReturning(async () => undefined);
    await run(interceptor, contextOf(routes.scoped, "/n"), next);
    await run(interceptor, contextOf(routes.uncached, "/u"), next);
    await run(interceptor, contextOf(routes.shared, "/p", undefined, "POST"), next);

    expect(store.data.size).toBe(0);
  });
});

const payload = {
  name: "Игрок ☃ \"quoted\"",
  nested: [{ ratio: 1.5, empty: null, dropped: undefined }],
  at: new Date(0),
  big: 2 ** 53,
};

@Controller("probe")
class Probe {
  @Get("plain")
  plain() {
    return payload;
  }

  @CacheTTL(10)
  @CacheShared()
  @Get("cached")
  cached() {
    return payload;
  }

  @Get("plain-text")
  plainText() {
    return "hello";
  }

  @CacheTTL(10)
  @CacheShared()
  @Get("cached-text")
  cachedText() {
    return "hello";
  }
}

describe("HttpCacheInterceptor over Fastify", () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [Probe],
      providers: [
        { provide: RedisCacheStore, useValue: memoryStore() },
        { provide: APP_INTERCEPTOR, useClass: HttpCacheInterceptor },
      ],
    }).compile();
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter(), { logger: false });
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(() => app.close());

  const fetchOne = async (url: string) => {
    const res = await app.inject({ method: "GET", url });
    const { date, "x-cache": cache, ...headers } = res.headers;
    return { status: res.statusCode, body: res.body, headers, cache };
  };

  it.each([
    ["plain", "cached"],
    ["plain-text", "cached-text"],
  ])("answers MISS and HIT for %s exactly like the uncached route", async (plain, cached) => {
    const baseline = await fetchOne(`/probe/${plain}`);
    const miss = await fetchOne(`/probe/${cached}`);
    const hit = await fetchOne(`/probe/${cached}`);

    expect(miss).toEqual({ ...baseline, cache: "MISS" });
    expect(hit).toEqual({ ...baseline, cache: "HIT" });
  });
});
