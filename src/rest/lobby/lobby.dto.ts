import { UserDTO } from "../shared.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Dota_GameMode } from "../../gateway/shared-types/dota-game-mode";
import { Dota_Map } from "../../gateway/shared-types/dota-map";
import { MessageObjectDto } from "../match/dto/match.dto";
import { IsOptional, MinLength } from "class-validator";

export class LobbySlotDto {
  user: UserDTO;

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

  password?: string;
  requiresPassword: boolean;

  name: string;

  fillBots: boolean;
  enableCheats: boolean;
}

export class UpdateLobbyDto {
  @ApiProperty({ enum: Dota_GameMode, enumName: "Dota_GameMode" })
  gameMode?: Dota_GameMode;

  @ApiProperty({ enum: Dota_Map, enumName: "Dota_Map" })
  map?: Dota_Map;

  @IsOptional()
  @MinLength(1)
  password?: string;

  @MinLength(3)
  name?: string;

  fillBots?: boolean;
  enableCheats?: boolean;
}

export class KickPlayerDto {
  steamId: string;
}

export class ChangeTeamInLobbyDto {
  steamId?: string;
  team?: number;
  index?: number;
}

class LobbyUpdateType {
  data?: LobbyDto;
  lobbyId: string;
}

export class LobbyUpdateDto extends MessageObjectDto<LobbyUpdateType> {
  data: LobbyUpdateType;
}
