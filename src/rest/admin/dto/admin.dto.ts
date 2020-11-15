import { Dota2Version } from '../../../gateway/shared-types/dota2version';
import { PlayerId } from '../../../gateway/shared-types/player-id';
import { MatchmakingMode } from '../../../gateway/shared-types/matchmaking-mode';
import { Role } from '../../../gateway/shared-types/roles';

export class MatchInfoDto {
  constructor(
    public readonly mode: MatchmakingMode,
    public readonly roomId: string,
    public readonly radiant: string[],
    public readonly dire: string[],
    public readonly averageMMR: number,
    public readonly version: Dota2Version,
  ) {}
}

export class EventAdminDto {
  name: string;
  body: any;
}

export class GameServerDto {
  url: string;
  version: Dota2Version;
}

export class GameSessionDto {
  url: string;
  matchId: number;
  info: MatchInfoDto;
}

export class UpdateRolesDto {
  steam_id: string;
  roles: Role[]
}
