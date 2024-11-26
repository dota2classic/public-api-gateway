import { Injectable } from "@nestjs/common";
import { GetPartyQuery } from "../gateway/queries/GetParty/get-party.query";
import { GetPartyQueryResult } from "../gateway/queries/GetParty/get-party-query.result";
import { PlayerId } from "../gateway/shared-types/player-id";
import { GetSessionByUserQuery } from "../gateway/queries/GetSessionByUser/get-session-by-user.query";
import { GetSessionByUserQueryResult } from "../gateway/queries/GetSessionByUser/get-session-by-user-query.result";
import { Dota2Version } from "../gateway/shared-types/dota2version";
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
      new GetPartyQuery(new PlayerId(steamId)),
    );

    const banStatuses = await Promise.all(
      party.players.map(({ value }) => this.api.playerControllerBanInfo(value)),
    );

    const sessions = await Promise.all(
      party.players.map((pid) =>
        this.qbus
          .execute<
            GetSessionByUserQuery,
            GetSessionByUserQueryResult
          >(new GetSessionByUserQuery(pid))
          .then((result) => ({ pid, result })),
      ),
    );

    const summaries = await Promise.all(
      party.players.map(({ value }) =>
        this.api.playerControllerPlayerSummary(Dota2Version.Dota_684, value),
      ),
    );
    return this.mapper.mapParty(party, banStatuses, summaries, sessions);
  }
}
