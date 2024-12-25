import { LobbyEntity } from "../../../entity/lobby.entity";
import { LobbyEvent } from "./lobby.event";

export class LobbyUpdatedEvent implements LobbyEvent {
  public lobbyId: string;
  constructor(public readonly lobbyEntity: LobbyEntity) {
    this.lobbyId = lobbyEntity.id;
  }
}
