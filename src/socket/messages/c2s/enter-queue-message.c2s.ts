import { MatchmakingMode } from "../../../gateway/shared-types/matchmaking-mode";

export class EnterQueueMessageC2S {
  constructor(public readonly modes: MatchmakingMode[]) {}
}
