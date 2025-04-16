import { Injectable } from "@nestjs/common";
import { GetPartyQuery } from "../gateway/queries/GetParty/get-party.query";
import { GetPartyQueryResult } from "../gateway/queries/GetParty/get-party-query.result";
import { PlayerId } from "../gateway/shared-types/player-id";
import { GetSessionByUserQuery } from "../gateway/queries/GetSessionByUser/get-session-by-user.query";
import { GetSessionByUserQueryResult } from "../gateway/queries/GetSessionByUser/get-session-by-user-query.result";
import { QueryBus } from "@nestjs/cqrs";
import { PlayerApi } from "../generated-api/gameserver";
import { PlayerMapper } from "./player/player.mapper";
import { PartyDto } from "./player/dto/party.dto";

@Injectable()
export class PartyService {
  constructor(
    private readonly qbus: QueryBus,
    private readonly api: PlayerApi,
    private readonly mapper: PlayerMapper,
  ) {}

  public async getParty(steamId: string): Promise<PartyDto> {
    const party = await this.qbus.execute<GetPartyQuery, GetPartyQueryResult>(
      new GetPartyQuery(steamId),
    );

    const [sessions, banStatuses, summaries] = await Promise.combine([
      Promise.all(
        party.players.map((steamId) =>
          this.qbus
            .execute<
              GetSessionByUserQuery,
              GetSessionByUserQueryResult
            >(new GetSessionByUserQuery(new PlayerId(steamId)))
            .then((result) => ({ steamId, result })),
        ),
      ),
      Promise.all(
        party.players.map((steamId) =>
          this.api.playerControllerBanInfo(steamId),
        ),
      ),
      Promise.all(
        party.players.map((steamId) =>
          this.api.playerControllerPlayerSummary(steamId),
        ),
      ),
    ]);

    return this.mapper.mapParty(party, banStatuses, summaries, sessions);
  }
}
