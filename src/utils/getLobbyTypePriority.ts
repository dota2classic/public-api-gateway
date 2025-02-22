import { MatchmakingMode } from "../gateway/shared-types/matchmaking-mode";

export const getLobbyTypePriority = (type: MatchmakingMode): number => {
  let score = Number(type);

  if (type === MatchmakingMode.UNRANKED) {
    score -= 1000;
  } else if (type === MatchmakingMode.BOTS_2X2) {
    score -= 100;
  }
  return score;
};
