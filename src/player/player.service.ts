import { Inject, Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { SocketGateway } from "../socket/socket.gateway";
import { ClientProxy } from "@nestjs/microservices";
import { UserMightExistEvent } from "../gateway/events/user/user-might-exist.event";
import { PlayerId } from "../gateway/shared-types/player-id";

@Injectable()
export class PlayerService {
  constructor(
    private readonly ds: DataSource,
    private readonly socketGateway: SocketGateway,
    @Inject("QueryCore") private readonly redisEventQueue: ClientProxy,
  ) {}

  notifyMightExist(steamId: string): void {
    this.redisEventQueue.emit(
      UserMightExistEvent.name,
      new UserMightExistEvent(new PlayerId(steamId)),
    );
  }

  async search(name: string, count: number, friendSteamIds: string[] = []): Promise<string[]> {
    const online = await this.socketGateway.getOnlineSteamIds();
    const parametrizedLike = `%${name.replace(/%/g, "")}%`;
    const results = await this.ds.query<{ steam_id: string }[]>(
      `
SELECT
    ue.steam_id,
    CASE
        WHEN $4::text[] @> ARRAY[ue.steam_id::text]
        THEN 20000
        WHEN $3::text[] @> ARRAY[ue.steam_id::text]
        THEN 10000
        ELSE 1
    END AS score
FROM user_entity ue
WHERE ue.name ILIKE $1
ORDER BY score DESC
LIMIT $2;
    `,
      [parametrizedLike, count, online, friendSteamIds],
    );
    return results.map((r) => r.steam_id);
  }
}
