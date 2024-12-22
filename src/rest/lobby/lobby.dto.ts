import { UserDTO } from "../shared.dto";
import { DotaTeam } from "../../gateway/shared-types/dota-team";
import { ApiProperty } from "@nestjs/swagger";
import { Dota_GameMode } from "../../gateway/shared-types/dota-game-mode";
import { Dota_Map } from "../../gateway/shared-types/dota-map";

export class LobbySlotDto {
  user: UserDTO;

  @ApiProperty({ enum: DotaTeam, enumName: "DotaTeam" })
  team?: DotaTeam;
}

export class LobbyDto {
  id: string;

  slots: LobbySlotDto[];

  @ApiProperty({ enum: Dota_GameMode, enumName: "Dota_GameMode" })
  gameMode: Dota_GameMode;

  @ApiProperty({ enum: Dota_Map, enumName: "Dota_Map" })
  map: Dota_Map;
}

export class UpdateLobbyDto {
  @ApiProperty({ enum: Dota_GameMode, enumName: "Dota_GameMode" })
  gameMode?: Dota_GameMode;

  @ApiProperty({ enum: Dota_Map, enumName: "Dota_Map" })
  map?: Dota_Map;
}

export class ChangeTeamInLobbyDto {
  @ApiProperty({ enum: DotaTeam, enumName: "DotaTeam" })
  team?: DotaTeam;
}
