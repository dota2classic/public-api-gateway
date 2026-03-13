import { PlayerFinishedMatchEvent } from "../../gateway/events/gs/player-finished-match.event";

export class PlayerFinishedMatchCommand {
  constructor(public readonly event: PlayerFinishedMatchEvent) {}
}
