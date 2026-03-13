import { PlayerSmurfDetectedEvent } from "../../gateway/events/bans/player-smurf-detected.event";

export class PlayerSmurfDetectedCommand {
  constructor(public readonly event: PlayerSmurfDetectedEvent) {}
}
