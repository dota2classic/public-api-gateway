import { Injectable } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { PlayerApi } from "../generated-api/gameserver";
import { PlayerMapper } from "./player/player.mapper";
import { PartyDto } from "./player/dto/party.dto";
import { MatchmakerApi } from "../generated-api/matchmaker";
import { LobbyService } from "./lobby/lobby.service";

@Injectable()
export class PartyService {
  constructor(
    private readonly qbus: QueryBus,
    private readonly api: PlayerApi,
    private readonly mapper: PlayerMapper,
    private readonly matchmakerApi: MatchmakerApi,
    private readonly lobby: LobbyService,
  ) {}

  public async getPartyRaw(steamId: string) {
    return this.matchmakerApi.matchmakerApiControllerGetUserParty(steamId);
  }

  public async getParty(steamId: string): Promise<PartyDto> {
    const party = await this.getPartyRaw(steamId);

    const [banStatuses, summaries, lobbies] = await Promise.combine([
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
      Promise.all(
        party.players.map((steamId) => this.lobby.getLobbyOf(steamId)),
      ),
    ]);

    return this.mapper.mapParty(party, banStatuses, summaries, lobbies);
  }
}
