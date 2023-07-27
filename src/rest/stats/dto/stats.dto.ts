import { MatchmakingMode } from '../../../gateway/shared-types/matchmaking-mode';
import { Dota2Version } from '../../../gateway/shared-types/dota2version';

export class CurrentOnlineDto {
  inGame: number;
  sessions: number;
  servers: number;
}


export class MatchmakingInfo {
  mode: MatchmakingMode;
  enabled: boolean;
  version: Dota2Version;
}
