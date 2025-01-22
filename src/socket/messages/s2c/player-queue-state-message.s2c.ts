import { MatchmakingMode } from "../../../gateway/shared-types/matchmaking-mode";

export class PlayerQueueStateMessageS2C {
  constructor(
    public readonly partyId: string,
    public readonly modes: MatchmakingMode[],
    public readonly inQueue: boolean,
  ) {}
}
