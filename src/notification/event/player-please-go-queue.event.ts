import { MatchmakingMode } from "../../gateway/shared-types/matchmaking-mode";

export class PlayerPleaseGoQueueEvent {
  constructor(
    public readonly steamId: string,
    public readonly mode: MatchmakingMode,
    public readonly inQueue: number,
  ) {}
}
