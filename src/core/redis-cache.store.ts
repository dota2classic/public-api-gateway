import { Inject, Injectable } from "@nestjs/common";
import { CacheStore } from "@nestjs/cache-manager";
import Redis from "ioredis";

@Injectable()
export class RedisCacheStore implements CacheStore {
  constructor(@Inject("REDIS") private readonly redis: Redis) {}

  async get<T>(key: string): Promise<T | undefined> {
    const raw = await this.getRaw(key);
    return raw === undefined ? undefined : JSON.parse(raw);
  }

  set<T>(key: string, value: T, options?: { ttl?: number }): Promise<void> {
    return this.setRaw(key, JSON.stringify(value), options?.ttl);
  }

  async getRaw(key: string): Promise<string | undefined> {
    return (await this.redis.get(key)) ?? undefined;
  }

  async setRaw(key: string, raw: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redis.set(key, raw, "EX", ttl);
    } else {
      await this.redis.set(key, raw);
    }
  }
}
