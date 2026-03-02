import { Injectable } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiClient } from "@dota2classic/gs-api-generated/dist/module";
import { PlayerMapper } from "./player/player.mapper";
import { PartyDto } from "./player/dto/party.dto";
import { MatchmakerApi } from "../generated-api/matchmaker";
import { LobbyService } from "./lobby/lobby.service";

@Injectable()
export class PartyService {
  constructor(
    private readonly qbus: QueryBus,
    private readonly gsApi: ApiClient,
    private readonly mapper: PlayerMapper,
    private readonly matchmakerApi: MatchmakerApi,
    private readonly lobby: LobbyService,
  ) {}

  public async getPartyRaw(steamId: string) {
    return this.matchmakerApi.matchmakerApiControllerGetUserParty(steamId);
  }

  public async getParty(steamId: string): Promise<PartyDto> {
    const party = await this.getPartyRaw(steamId);

    const [banStatusesRes, summariesRes, lobbies] = await Promise.combine([
      Promise.all(
        party.players.map((steamId) =>
          this.gsApi.player.playerControllerBanInfo(steamId),
        ),
      ),
      Promise.all(
        party.players.map((steamId) =>
          this.gsApi.player.playerControllerPlayerSummary(steamId),
        ),
      ),
      Promise.all(
        party.players.map((steamId) => this.lobby.getLobbyOf(steamId)),
      ),
    ]);

    const banStatuses = banStatusesRes.map((r) => r.data);
    const summaries = summariesRes.map((r) => r.data);

    return this.mapper.mapParty(party, banStatuses, summaries, lobbies);
  }
}
