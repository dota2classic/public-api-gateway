import { PlayerNotLoadedEvent } from "../../gateway/events/bans/player-not-loaded.event";

export class PlayerNotLoadedCommand {
  constructor(public readonly event: PlayerNotLoadedEvent) {}
}
