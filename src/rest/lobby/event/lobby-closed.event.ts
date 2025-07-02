import { LobbyEvent } from "./lobby.event";

export class LobbyClosedEvent implements LobbyEvent {
  constructor(
    public readonly lobbyId: string,
    public readonly affectedSteamId: string[],
  ) {}
}
