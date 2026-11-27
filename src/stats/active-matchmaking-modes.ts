import { MatchmakingMode, MatchmakingModes } from "../gateway/shared-types/matchmaking-mode";

export const activeMatchmakingModes = [...MatchmakingModes, MatchmakingMode.SECRET];
