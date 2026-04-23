import { MatchmakingMode } from "../../../gateway/shared-types/matchmaking-mode";
import { DeclineReason } from "../../../gateway/events/mm/player-declined-game.event";

export class PlayerDeclineGameMessageS2C {
  constructor(
    public readonly mode: MatchmakingMode,
    public readonly reason: DeclineReason,
  ) {}
}
