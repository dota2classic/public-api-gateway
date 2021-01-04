import { Dota2Version } from '../../../gateway/shared-types/dota2version';
import { PlayerId } from '../../../gateway/shared-types/player-id';
import { MatchmakingMode } from '../../../gateway/shared-types/matchmaking-mode';
import { Role } from '../../../gateway/shared-types/roles';
import { BanStatus } from '../../../gateway/queries/GetPlayerInfo/get-player-info-query.result';
import { BanReason } from '../../../gateway/shared-types/ban';

export class MatchInfoDto {
  mode: MatchmakingMode;
  roomId: string;
  radiant: string[];
  dire: string[];
  averageMMR: number;
  version: Dota2Version;
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
  role: Role;
  end_time: number
}




export class RoleSubscriptionEntryDto {
  end_time: number;
  role: Role;
  steam_id: string;
}


export class UserRoleSummaryDto {
  public readonly steam_id: string;
  public readonly name: string;
  public readonly entries: RoleSubscriptionEntryDto[];
}


export class BanStatusDto {
  public readonly isBanned: boolean;
  public readonly bannedUntil: number;
  public readonly status: BanReason;
}

export class UserBanSummaryDto {
  public readonly steam_id: string;
  public readonly banStatus: BanStatusDto
}

export class BanHammerDto {
  public readonly endTime: number;
}

export class StopServerDto {
  public readonly url: string;
}
