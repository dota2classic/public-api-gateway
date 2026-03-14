import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { SocketGateway } from "../socket/socket.gateway";

@Injectable()
export class PlayerService {
  constructor(
    private readonly ds: DataSource,
    private readonly socketGateway: SocketGateway,
  ) {}

  async search(name: string, count: number): Promise<string[]> {
    const online = await this.socketGateway.getOnlineSteamIds();
    const parametrizedLike = `%${name.replace(/%/g, "")}%`;
    const results = await this.ds.query<{ steam_id: string }[]>(
      `
SELECT
    ue.steam_id,
    CASE
        WHEN $3::text[] @> ARRAY[ue.steam_id::text]
        THEN 10000
        ELSE 1
    END AS score
FROM user_entity ue
WHERE ue.name ILIKE $1
ORDER BY score DESC
LIMIT $2;
    `,
      [parametrizedLike, count, online],
    );
    return results.map((r) => r.steam_id);
  }
}
