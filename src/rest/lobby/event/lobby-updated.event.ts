import { LobbyEntity } from "../../../entity/lobby.entity";
import { LobbyAction } from "../lobby.dto";

export class LobbyUpdatedEvent {
  constructor(
    public readonly action: LobbyAction,
    public readonly affectedSteamId: string[],
    public readonly lobbyId: string,
    public readonly lobbyEntity?: LobbyEntity,
    public readonly kickedIds: string[] = [],
  ) {}
}
