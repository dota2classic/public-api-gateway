import { MatchmakingMode } from "../../../gateway/shared-types/matchmaking-mode";

export class PlayerGameStateMessageS2C {
  constructor(
    public readonly serverUrl: string,
    public readonly matchId: number,
    public readonly lobbyType: MatchmakingMode,
    public readonly abandoned: boolean
  ) {}
}
