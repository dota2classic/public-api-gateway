import { Injectable } from "@nestjs/common";
import { PlayerMapper } from "./player/player.mapper";
import { PartyDto } from "./player/dto/party.dto";
import { ApiClient as MatchmakerApiClient } from "@dota2classic/matchmaker-generated/dist/module";
import { LobbyService } from "./lobby/lobby.service";
import { PlayerSummaryService } from "./service/player-summary.service";

@Injectable()
export class PartyService {
  constructor(
    private readonly playerSummaries: PlayerSummaryService,
    private readonly mapper: PlayerMapper,
    private readonly matchmakerApi: MatchmakerApiClient,
    private readonly lobby: LobbyService,
  ) {}

  public async getPartyRaw(steamId: string) {
    return (await this.matchmakerApi.player.matchmakerApiControllerGetUserParty(steamId)).data;
  }

  public async getParty(steamId: string): Promise<PartyDto> {
    const party = await this.getPartyRaw(steamId);

    const [summaries, lobbies] = await Promise.all([
      this.playerSummaries.getMany(party.players),
      Promise.all(party.players.map((steamId) => this.lobby.getLobbyOf(steamId))),
    ]);

    return this.mapper.mapParty(party, summaries, lobbies);
  }
}
