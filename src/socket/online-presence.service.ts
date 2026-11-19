import { Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { ClientType, PlayerSocket } from "./player.socket";
import { OnlineEntry } from "./messages/s2c/online-update-message.s2c";

const PRESENCE_KEY = "presence";
const PRESENCE_TTL_MS = 120_000;
const REFRESH_INTERVAL_MS = 30_000;

export interface OnlineClients {
  steamIds: string[];
  clients: OnlineEntry[];
}

interface Presence {
  member: string;
  refreshedAt: number;
}

@Injectable()
export class OnlinePresenceService {
  private readonly sockets = new Map<string, Presence>();

  constructor(@Inject("REDIS") private readonly redis: Redis) {}

  public async connect(socket: PlayerSocket): Promise<void> {
    const presence = {
      member: `${socket.steamId}|${socket.clientType}|${socket.id}`,
      refreshedAt: 0,
    };
    this.sockets.set(socket.id, presence);
    await this.write(presence, Date.now());
  }

  public async refresh(socket: PlayerSocket): Promise<void> {
    const presence = this.sockets.get(socket.id);
    const now = Date.now();
    if (!presence || now - presence.refreshedAt < REFRESH_INTERVAL_MS) return;
    await this.write(presence, now);
  }

  public async disconnect(socket: PlayerSocket): Promise<boolean> {
    const presence = this.sockets.get(socket.id);
    if (!presence) return false;
    this.sockets.delete(socket.id);
    await this.redis.zrem(PRESENCE_KEY, presence.member);
    return true;
  }

  public async clients(): Promise<OnlineClients> {
    const now = Date.now();
    const [, [error, live]] = await this.redis
      .multi()
      .zremrangebyscore(PRESENCE_KEY, "-inf", now)
      .zrangebyscore(PRESENCE_KEY, now, "+inf")
      .exec();
    if (error) throw error;

    const byId = new Map<string, ClientType>();
    for (const member of live as string[]) {
      const [steamId, clientType] = member.split("|") as [string, ClientType];
      if (!byId.has(steamId) || clientType === ClientType.LAUNCHER) {
        byId.set(steamId, clientType);
      }
    }
    const clients = Array.from(byId, ([steamId, clientType]) => ({ steamId, clientType }));
    return { steamIds: clients.map((c) => c.steamId), clients };
  }

  public async steamIds(): Promise<string[]> {
    return (await this.clients()).steamIds;
  }

  private async write(presence: Presence, now: number) {
    presence.refreshedAt = now;
    await this.redis.zadd(PRESENCE_KEY, now + PRESENCE_TTL_MS, presence.member);
  }
}
