import { UserDTO } from "../shared.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Dota_GameMode } from "../../gateway/shared-types/dota-game-mode";
import { Dota_Map } from "../../gateway/shared-types/dota-map";
import { MessageObjectDto } from "../match/dto/match.dto";
import { IsOptional, MinLength } from "class-validator";
import { DotaPatch } from "../../gateway/constants/patch";
import { Region } from "../../gateway/shared-types/region";

export class LobbySlotDto {
  user?: UserDTO;

  index: number;
  team?: number;
}

export class JoinLobbyDto {
  password?: string;
}

export class LobbyDto {
  id: string;

  owner: UserDTO;

  slots: LobbySlotDto[];

  @ApiProperty({ enum: Dota_GameMode, enumName: "Dota_GameMode" })
  gameMode: Dota_GameMode;

  @ApiProperty({ enum: Dota_Map, enumName: "Dota_Map" })
  map: Dota_Map;

  @ApiProperty({ enum: DotaPatch, enumName: "DotaPatch" })
  patch: DotaPatch;

  @ApiProperty({ enum: Region, enumName: "Region" })
  region: Region;

  password?: string;
  requiresPassword: boolean;

  name: string;

  fillBots: boolean;
  enableCheats: boolean;

  noRunes: boolean;
  enableBanStage: boolean;
  midTowerToWin: boolean;
  midTowerKillsToWin: number;
}

export class UpdateLobbyDto {
  @ApiProperty({ enum: Dota_GameMode, enumName: "Dota_GameMode" })
  gameMode?: Dota_GameMode;

  @ApiProperty({ enum: Dota_Map, enumName: "Dota_Map" })
  map?: Dota_Map;

  @ApiProperty({ enum: Region, enumName: "Region" })
  region?: Region;

  @IsOptional()
  @MinLength(1)
  password?: string;

  @MinLength(3)
  name?: string;

  fillBots?: boolean;
  enableCheats?: boolean;
  enableBanStage?: boolean;

  @ApiProperty({ enum: DotaPatch, enumName: "DotaPatch" })
  patch?: DotaPatch;

  noRunes?: boolean;
  midTowerToWin?: boolean;
  midTowerKillsToWin?: number;
}

export class KickPlayerDto {
  steamId: string;
}

export class ChangeTeamInLobbyDto {
  steamId?: string;
  team?: number;
  index?: number;
}

export enum LobbyAction {
  Update = "update",
  Close = "close",
  Start = "start",
  Kick = "kick",
}
class LobbyUpdateType {
  data?: LobbyDto;
  action: LobbyAction;
  lobbyId: string;
  kickedSteamIds: string[];
}

export class LobbyUpdateDto extends MessageObjectDto<LobbyUpdateType> {
  data: LobbyUpdateType;
}
