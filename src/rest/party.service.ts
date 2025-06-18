import { Injectable } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { PlayerApi } from "../generated-api/gameserver";
import { PlayerMapper } from "./player/player.mapper";
import { PartyDto } from "./player/dto/party.dto";
import { MatchmakerApi } from "../generated-api/matchmaker";

@Injectable()
export class PartyService {
  constructor(
    private readonly qbus: QueryBus,
    private readonly api: PlayerApi,
    private readonly mapper: PlayerMapper,
    private readonly matchmakerApi: MatchmakerApi,
  ) {}

  public async getPartyRaw(steamId: string) {
    return this.matchmakerApi.matchmakerApiControllerGetUserParty(steamId);
  }

  public async getParty(steamId: string): Promise<PartyDto> {
    const party = await this.getPartyRaw(steamId);

    const [banStatuses, summaries] = await Promise.combine([
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

    return this.mapper.mapParty(party, banStatuses, summaries);
  }
}
