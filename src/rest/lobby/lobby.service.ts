import { Injectable } from "@nestjs/common";
import { LobbyEntity } from "../../entity/lobby.entity";
import { LobbySlotEntity } from "../../entity/lobby-slot.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CurrentUserDto } from "../../utils/decorator/current-user";
import { Role } from "../../gateway/shared-types/roles";

@Injectable()
export class LobbyService {
  constructor(
    @InjectRepository(LobbyEntity)
    private readonly lobbyEntityRepository: Repository<LobbyEntity>,
    @InjectRepository(LobbySlotEntity)
    private readonly lobbySlotEntityRepository: Repository<LobbySlotEntity>,
  ) {}

  public async getLobby(
    id: string,
    askedBy: CurrentUserDto,
  ): Promise<LobbyEntity> {
    let q = this.lobbyEntityRepository
      .createQueryBuilder("l")
      .where("l.id = :id", { id })
      .leftJoinAndSelect("l.slots", "slots");

    // If casual player, need to check permissions
    if (
      !askedBy.roles.includes(Role.ADMIN) &&
      !askedBy.roles.includes(Role.MODERATOR)
    ) {
      q = q.innerJoin(
        LobbySlotEntity,
        "lse",
        "lse.lobby_id = l.id and lse.steam_id = :steam_id",
        { steam_id: askedBy.steam_id },
      );
    }

    return q.getOneOrFail();
  }

  public async createLobby(user: CurrentUserDto): Promise<LobbyEntity> {
    let lobby = new LobbyEntity();
    lobby = await this.lobbyEntityRepository.save(lobby);
    const lse = new LobbySlotEntity(lobby.id, user.steam_id);
    await this.lobbySlotEntityRepository.save(lse);
    return this.getLobby(lobby.id, user);
  }
}
