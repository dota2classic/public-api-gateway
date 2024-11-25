import { MatchmakingMode } from "../../../gateway/shared-types/matchmaking-mode";
import { Dota2Version } from "../../../gateway/shared-types/dota2version";

export class EnterQueueMessageC2S {
  constructor(
    public readonly mode: MatchmakingMode,
    public readonly version: Dota2Version,
  ) {}
}
