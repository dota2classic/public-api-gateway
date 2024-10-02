import { Dota2Version } from '../../../gateway/shared-types/dota2version';
import { MatchmakingMode } from '../../../gateway/shared-types/matchmaking-mode';
import { Role } from '../../../gateway/shared-types/roles';
import { BanReason } from '../../../gateway/shared-types/ban';
import { ApiProperty } from '@nestjs/swagger';
import { UserDTO } from '../../shared.dto';

export class MatchInfoDto {
  @ApiProperty({ enum: MatchmakingMode, enumName: 'MatchmakingMode' })
  mode: MatchmakingMode;
  roomId: string;
  radiant: UserDTO[];
  dire: UserDTO[];
  averageMMR: number;
  @ApiProperty({ enum: Dota2Version, enumName: 'Dota2Version' })
  version: Dota2Version;
}

export class EventAdminDto {
  name: string;
  body: any;
}

export class GameServerDto {
  url: string;
  @ApiProperty({ enum: Dota2Version, enumName: 'Dota2Version'})
  version: Dota2Version;
}

export class GameSessionDto {
  url: string;
  matchId: number;
  info: MatchInfoDto;
}

export class UpdateRolesDto {
  steam_id: string;
  @ApiProperty({ enum: Role, enumName: 'Role' })
  role: Role;
  end_time: number;
}

export class UpdateModeDTO {
  @ApiProperty({ enum: MatchmakingMode, enumName: 'MatchmakingMode' })
  mode: MatchmakingMode;
  @ApiProperty({ enum: Dota2Version, enumName: 'Dota2Version' })
  version: Dota2Version;
  enabled: boolean;
}

export class RoleSubscriptionEntryDto {
  end_time: number;
  @ApiProperty({ enum: Role, enumName: 'Role' })
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
  @ApiProperty({ enum: BanReason, enumName: 'BanReason' })
  public readonly status: BanReason;
}

export class UserBanSummaryDto {
  public readonly steam_id: string;
  public readonly banStatus: BanStatusDto;
}

export class BanHammerDto {
  public readonly endTime: number;
}

export class StopServerDto {
  public readonly url: string;
}


export class QueueEntryDTO {
  partyId: string;
  players: UserDTO[]
}


export class QueueStateDTO {
  @ApiProperty({ enum: MatchmakingMode, enumName: 'MatchmakingMode' })
  mode: MatchmakingMode

  entries: QueueEntryDTO[];
}
