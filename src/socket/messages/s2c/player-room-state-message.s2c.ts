import { MatchmakingMode } from "../../../gateway/shared-types/matchmaking-mode";
import { ReadyState } from "../../../gateway/events/ready-state-received.event";

export class PlayerRoomEntry {
  constructor(
    public readonly steamId: string,
    public readonly state: ReadyState,
  ) {}
}

export class PlayerRoomStateMessageS2C {
  constructor(
    public readonly roomId: string,
    public readonly mode: MatchmakingMode,
    public readonly entries: PlayerRoomEntry[],
  ) {}
}
