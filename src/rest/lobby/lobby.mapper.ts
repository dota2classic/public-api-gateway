import { Injectable } from "@nestjs/common";
import { UserRepository } from "../../cache/user/user.repository";
import { LobbyEntity } from "../../entity/lobby.entity";
import { LobbyDto, LobbySlotDto } from "./lobby.dto";
import { LobbySlotEntity } from "../../entity/lobby-slot.entity";

@Injectable()
export class LobbyMapper {
  constructor(private readonly uRep: UserRepository) {}

  public mapLobbySlot = async (
    slot: LobbySlotEntity,
  ): Promise<LobbySlotDto> => ({
    user: await this.uRep.userDto(slot.steamId),
    team: slot.team,
  });

  public mapLobby = async (lobby: LobbyEntity): Promise<LobbyDto> => ({
    id: lobby.id,
    gameMode: lobby.gameMode,
    map: lobby.map,
    slots: await Promise.all(lobby.slots.map(this.mapLobbySlot)),
  });
}
