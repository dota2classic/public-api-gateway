import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
  SetMetadata,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { CACHE_TTL_METADATA, CacheStore } from "@nestjs/cache-manager";
import { RedisCacheStore } from "../core/redis-cache.store";
import { isNil } from "@nestjs/common/utils/shared.utils";
import { FastifyReply, FastifyRequest } from "fastify";
import { from, lastValueFrom, Observable, of } from "rxjs";
import { CurrentUserDto } from "./decorator/current-user";

const CACHE_SHARED_METADATA = "http_cache:shared";

export const CacheShared = () => SetMetadata(CACHE_SHARED_METADATA, true);

@Injectable()
export class HttpCacheInterceptor implements NestInterceptor {
  private readonly logger = new Logger(HttpCacheInterceptor.name);
  private readonly inFlight = new Map<string, Promise<unknown>>();

  constructor(
    @Inject(RedisCacheStore) private readonly cache: CacheStore,
    private readonly reflector: Reflector,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    if (context.getType() !== "http") {
      return next.handle();
    }
    const targets = [context.getHandler(), context.getClass()];
    const ttl = this.reflector.getAllAndOverride<number | undefined>(CACHE_TTL_METADATA, targets);
    const http = context.switchToHttp();
    const req = http.getRequest<FastifyRequest & { user?: CurrentUserDto }>();
    if (ttl === undefined || req.method !== "GET") {
      return next.handle();
    }

    const shared = this.reflector.getAllAndOverride<boolean>(CACHE_SHARED_METADATA, targets);
    const key = shared ? `http:${req.url}` : `http:${req.url}:${req.user?.steam_id ?? "anon"}`;
    const res = http.getResponse<FastifyReply>();

    const pending = this.inFlight.get(key);
    if (pending) {
      res.header("X-Cache", "WAIT");
      return from(pending);
    }

    const cached = await this.read(key);
    if (!isNil(cached)) {
      res.header("X-Cache", "HIT");
      return of(cached);
    }

    res.header("X-Cache", "MISS");
    return from(this.inFlight.get(key) ?? this.load(key, ttl, next));
  }

  private load(key: string, ttl: number, next: CallHandler): Promise<unknown> {
    const pending = lastValueFrom(next.handle())
      .then(async (value) => {
        if (!isNil(value)) {
          await this.write(key, value, ttl);
        }
        return value;
      })
      .finally(() => this.inFlight.delete(key));
    this.inFlight.set(key, pending);
    return pending;
  }

  private async read(key: string): Promise<unknown> {
    try {
      return await this.cache.get(key);
    } catch (e) {
      this.logger.warn(`Cache read failed for ${key}`, e);
      return undefined;
    }
  }

  private async write(key: string, value: unknown, ttl: number) {
    try {
      await this.cache.set(key, value, { ttl });
    } catch (e) {
      this.logger.warn(`Cache write failed for ${key}`, e);
    }
  }
}
