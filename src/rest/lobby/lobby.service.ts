import { HttpException, Injectable } from "@nestjs/common";
import { LobbyEntity } from "../../entity/lobby.entity";
import { LobbySlotEntity } from "../../entity/lobby-slot.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { CurrentUserDto } from "../../utils/decorator/current-user";
import { Role } from "../../gateway/shared-types/roles";
import { HttpStatusCode } from "axios";
import { Dota_GameMode } from "../../gateway/shared-types/dota-game-mode";
import { EventBus } from "@nestjs/cqrs";
import { MatchPlayer } from "../../gateway/events/room-ready.event";
import { MatchmakingMode } from "../../gateway/shared-types/matchmaking-mode";
import { Dota2Version } from "../../gateway/shared-types/dota2version";
import { PlayerId } from "../../gateway/shared-types/player-id";
import { LobbyReadyEvent } from "../../gateway/events/lobby-ready.event";
import { DotaTeam } from "../../gateway/shared-types/dota-team";
import { Dota_Map } from "../../gateway/shared-types/dota-map";

@Injectable()
export class LobbyService {
  constructor(
    @InjectRepository(LobbyEntity)
    private readonly lobbyEntityRepository: Repository<LobbyEntity>,
    @InjectRepository(LobbySlotEntity)
    private readonly lobbySlotEntityRepository: Repository<LobbySlotEntity>,
    private readonly datasource: DataSource,
    private readonly ebus: EventBus,
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
    let lobby = new LobbyEntity(user.steam_id);
    lobby = await this.lobbyEntityRepository.save(lobby);
    const lse = new LobbySlotEntity(lobby.id, user.steam_id);
    await this.lobbySlotEntityRepository.save(lse);
    return this.getLobby(lobby.id, user);
  }

  //
  public async closeLobby(id: string, user: CurrentUserDto) {
    let q = this.lobbyEntityRepository
      .createQueryBuilder("l")
      .where("l.id = :id", { id })
      .leftJoinAndSelect("l.slots", "slots");

    // If casual player, need to check permissions
    if (
      !user.roles.includes(Role.ADMIN) &&
      !user.roles.includes(Role.MODERATOR)
    ) {
      q = q.andWhere({
        ownerSteamId: user.steam_id,
      });
    }

    try {
      const lobby = await q.getOneOrFail();
      await this.datasource.transaction(async (em) => {
        await em.remove(lobby.slots);

        await em.remove(lobby);
      });
    } catch (e) {
      throw new HttpException("Not an owner", HttpStatusCode.Forbidden);
    }
  }

  public async joinLobby(
    id: string,
    user: CurrentUserDto,
  ): Promise<LobbyEntity> {
    const lobby = await this.lobbyEntityRepository.findOneOrFail({
      where: { id },
    });

    if (
      lobby.slots.findIndex((slot) => slot.steamId === user.steam_id) !== -1
    ) {
      throw new HttpException("Already in lobby", HttpStatusCode.Conflict);
    }

    const lse = await this.lobbySlotEntityRepository.save(
      new LobbySlotEntity(lobby.id, user.steam_id),
    );

    lobby.slots.push(lse);

    return lobby;
  }

  public async leaveLobby(id: string, user: CurrentUserDto): Promise<void> {
    const lobby = await this.lobbyEntityRepository.findOneOrFail({
      where: { id },
    });

    if (
      lobby.slots.findIndex((slot) => slot.steamId === user.steam_id) === -1
    ) {
      throw new HttpException("Not in lobby", HttpStatusCode.Conflict);
    }

    // If we are owner, close lobby as well
    if (lobby.ownerSteamId === user.steam_id) {
      return this.closeLobby(id, user);
    }

    await this.lobbySlotEntityRepository.delete({
      steamId: user.steam_id,
      lobbyId: lobby.id,
    });
  }

  public async updateLobby(
    id: string,
    user: CurrentUserDto,
    gameMode: Dota_GameMode | undefined,
    map: Dota_Map | undefined,
  ): Promise<LobbyEntity> {
    const lobby = await this.getLobby(id, user);

    lobby.gameMode = gameMode;
    lobby.map = map;
    return this.lobbyEntityRepository.save(lobby);
  }

  public async startLobby(id: string, user: CurrentUserDto) {
    const lobby = await this.getLobby(id, user);

    const filledSlots = lobby.slots.filter((it) => it.team);
    if (filledSlots.length === 0) {
      throw new HttpException(
        "Lobby must have at least 1 player in any team",
        HttpStatusCode.BadRequest,
      );
    }

    await this.ebus.publish(
      new LobbyReadyEvent(
        lobby.id,
        MatchmakingMode.LOBBY,
        lobby.map,
        lobby.gameMode,
        filledSlots.map(
          (slot) =>
            new MatchPlayer(
              new PlayerId(slot.steamId),
              slot.team,
              slot.steamId,
            ),
        ),
        Dota2Version.Dota_684,
      ),
    );

    await this.closeLobby(id, user);
  }

  public async changeTeam(
    id: string,
    user: CurrentUserDto,
    team: DotaTeam | undefined,
  ): Promise<LobbyEntity> {
    const lse = await this.lobbySlotEntityRepository.findOneOrFail({
      where: {
        lobbyId: id,
        steamId: user.steam_id,
      },
    });

    lse.team = team || null;
    await this.lobbySlotEntityRepository.save(lse);
    return this.getLobby(id, user);
  }
}
