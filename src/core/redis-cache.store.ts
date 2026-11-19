import { Inject, Injectable } from "@nestjs/common";
import { CacheStore } from "@nestjs/cache-manager";
import Redis from "ioredis";

@Injectable()
export class RedisCacheStore implements CacheStore {
  constructor(@Inject("REDIS") private readonly redis: Redis) {}

  async get<T>(key: string): Promise<T | undefined> {
    const raw = await this.redis.get(key);
    return raw === null ? undefined : JSON.parse(raw);
  }

  async set<T>(key: string, value: T, options?: { ttl?: number }): Promise<void> {
    const raw = JSON.stringify(value);
    if (options?.ttl) {
      await this.redis.set(key, raw, "EX", options.ttl);
    } else {
      await this.redis.set(key, raw);
    }
  }
}
