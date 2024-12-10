import { Dota2Version } from "../../../gateway/shared-types/dota2version";
import { MatchmakingMode } from "../../../gateway/shared-types/matchmaking-mode";
import { Role } from "../../../gateway/shared-types/roles";
import { BanReason } from "../../../gateway/shared-types/ban";
import { ApiProperty } from "@nestjs/swagger";
import { UserDTO } from "../../shared.dto";
import { Page } from "../../../gateway/shared-types/page";
import { Timestamp } from "../../../gateway/shared-types/dto-types";
import { Dota_GameMode } from "../../../gateway/shared-types/dota-game-mode";

export class MatchInfoDto {
  @ApiProperty({ enum: MatchmakingMode, enumName: "MatchmakingMode" })
  mode: MatchmakingMode;
  roomId: string;
  radiant: UserDTO[];
  dire: UserDTO[];
  averageMMR: number;
  @ApiProperty({ enum: Dota2Version, enumName: "Dota2Version" })
  version: Dota2Version;
}

export class EventAdminDto {
  name: string;
  body: any;
}

export class GameServerDto {
  url: string;
  @ApiProperty({ enum: Dota2Version, enumName: "Dota2Version" })
  version: Dota2Version;
}

export class GameSessionDto {
  url: string;
  matchId: number;
  info: MatchInfoDto;
}

export class UpdateRolesDto {
  steam_id: string;
  @ApiProperty({ enum: Role, enumName: "Role" })
  role: Role;
  end_time: number;
}

export class UpdateModeDTO {
  @ApiProperty({ enum: MatchmakingMode, enumName: "MatchmakingMode" })
  mode: MatchmakingMode;
  @ApiProperty({ enum: Dota_GameMode, enumName: "Dota_GameMode" })
  dotaGameMode: Dota_GameMode;

  enabled: boolean;
}

export class RoleSubscriptionEntryDto {
  end_time: number;
  @ApiProperty({ enum: Role, enumName: "Role" })
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
  // iso
  public readonly bannedUntil: string;
  @ApiProperty({ enum: BanReason, enumName: "BanReason" })
  public readonly status: BanReason;
}

export class UserBanSummaryDto {
  public readonly steam_id: string;
  public readonly banStatus: BanStatusDto;
}

export class BanHammerDto {
  public readonly endTime: Timestamp;

  @ApiProperty({ enum: BanReason, enumName: "BanReason" })
  public readonly reason: BanReason;
}

export class StopServerDto {
  public readonly url: string;
}

export class QueueEntryDTO {
  partyId: string;
  players: UserDTO[];
}

export class QueueStateDTO {
  @ApiProperty({ enum: MatchmakingMode, enumName: "MatchmakingMode" })
  mode: MatchmakingMode;

  entries: QueueEntryDTO[];
}

export class CrimeLogDto {
  readonly id: number;
  readonly handled: boolean;
  readonly user: UserDTO;

  @ApiProperty({ enum: BanReason, enumName: "BanReason" })
  readonly crime: BanReason;

  @ApiProperty({ enum: MatchmakingMode, enumName: "MatchmakingMode" })
  readonly lobby_type: MatchmakingMode;

  readonly created_at: string;
  readonly ban_duration: number;
}
export class CrimeLogPageDto extends Page<CrimeLogDto> {
  data: CrimeLogDto[];
  pages: number;
  perPage: number;
  page: number;
}
