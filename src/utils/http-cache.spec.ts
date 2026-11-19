import { CallHandler, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { CacheStore, CacheTTL } from "@nestjs/cache-manager";
import { lastValueFrom, Observable } from "rxjs";
import { CacheShared, HttpCacheInterceptor } from "./http-cache";

class Routes {
  @CacheTTL(10)
  scoped() {}

  @CacheTTL(10)
  @CacheShared()
  shared() {}

  uncached() {}
}

const memoryStore = (): CacheStore & { data: Map<string, unknown> } => {
  const data = new Map<string, unknown>();
  return {
    data,
    get: async (key) => data.get(key) as never,
    set: async (key, value) => {
      data.set(key, value);
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
