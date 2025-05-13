import { Injectable } from "@nestjs/common";
import { LobbyEntity } from "../../entity/lobby.entity";
import { LobbyDto, LobbySlotDto } from "./lobby.dto";
import { LobbySlotEntity } from "../../entity/lobby-slot.entity";
import { UserProfileService } from "../../service/user-profile.service";

@Injectable()
export class LobbyMapper {
  constructor(private readonly user: UserProfileService) {}

  public mapLobbySlot = async (
    slot: LobbySlotEntity,
  ): Promise<LobbySlotDto> => ({
    user: await this.user.userDto(slot.steamId),
    team: slot.team,
    index: slot.indexInTeam,
  });

  public mapLobby = async (
    lobby: LobbyEntity,
    mapFor?: string,
  ): Promise<LobbyDto> => {
    return {
      owner: await this.user.userDto(lobby.ownerSteamId),
      id: lobby.id,
      name: lobby.name,
      gameMode: lobby.gameMode,
      map: lobby.map,
      slots: await Promise.all(lobby.slots.map(this.mapLobbySlot)),
      requiresPassword: lobby.password !== null,
      password: mapFor === lobby.ownerSteamId ? lobby.password : "****",
      enableCheats: lobby.enableCheats,
      fillBots: lobby.fillBots,
    };
  };
}
