import { MatchmakingMode } from "../../../gateway/shared-types/matchmaking-mode";

export class PleaseGoQueueEvent {
  constructor(public readonly mode: MatchmakingMode) {}
}
