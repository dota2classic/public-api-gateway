import { ForbiddenException, HttpException, Injectable } from "@nestjs/common";
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
import { LobbyUpdatedEvent } from "./event/lobby-updated.event";
import { LobbyClosedEvent } from "./event/lobby-closed.event";

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
    askedBy?: CurrentUserDto,
  ): Promise<LobbyEntity> {
    let q = this.lobbyEntityRepository
      .createQueryBuilder("l")
      .where("l.id = :id", { id })
      .leftJoinAndSelect("l.slots", "slots");

    // If casual player, need to check permissions
    if (
      askedBy &&
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
    const lobbies = await this.lobbySlotEntityRepository.find({
      where: { steamId: user.steam_id },
    });
    await Promise.all(
      lobbies.map((lobby) => this.leaveLobby(lobby.lobbyId, user)),
    );
    // Need to leave from all other lobbies
    let lobby = new LobbyEntity(user.steam_id);
    lobby = await this.lobbyEntityRepository.save(lobby);
    const lse = new LobbySlotEntity(lobby.id, user.steam_id, 0);
    await this.lobbySlotEntityRepository.save(lse);

    return this.getLobby(lobby.id, user).then((lobby) => {
      this.ebus.publish(new LobbyUpdatedEvent(lobby));
      return lobby;
    });
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
        this.ebus.publish(new LobbyClosedEvent(id));
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
      // throw new HttpException("Already in lobby", HttpStatusCode.Conflict);
      // It's ok, just return it
      return lobby;
    }

    const lse = await this.lobbySlotEntityRepository.save(
      new LobbySlotEntity(lobby.id, user.steam_id, 0),
    );

    lobby.slots.push(lse);

    this.ebus.publish(new LobbyUpdatedEvent(lobby));
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
    lobby.slots.splice(
      lobby.slots.findIndex((t) => t.steamId === user.steam_id),
      1,
    );

    this.ebus.publish(new LobbyUpdatedEvent(lobby));
  }

  public async updateLobby(
    id: string,
    user: CurrentUserDto,
    gameMode: Dota_GameMode | undefined,
    map: Dota_Map | undefined,
  ): Promise<LobbyEntity> {
    let lobby = await this.getLobby(id, user);

    lobby.gameMode = gameMode;
    lobby.map = map;
    await this.lobbyEntityRepository.save(lobby);

    return this.getLobby(id, user).then((lobby) => {
      this.ebus.publish(new LobbyUpdatedEvent(lobby));
      return lobby;
    });
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

    // We need a lock for this maybe??

    await this.closeLobby(id, user).then(() =>
      this.ebus.publish(
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
      ),
    );
  }

  public async changeTeam(
    id: string,
    user: CurrentUserDto,
    steamId: string | undefined,
    team: DotaTeam | undefined,
    index: number,
  ): Promise<LobbyEntity> {
    const lobby = await this.getLobby(id, user);

    let lse: LobbySlotEntity;
    if (steamId) {
      if (user.steam_id !== lobby.ownerSteamId) {
        throw new ForbiddenException(
          "Only moderator or admin can manage players in lobby",
        );
      }
      lse = await this.lobbySlotEntityRepository.findOneOrFail({
        where: {
          lobbyId: id,
          steamId: steamId,
        },
      });
    } else {
      lse = await this.lobbySlotEntityRepository.findOneOrFail({
        where: {
          lobbyId: id,
          steamId: user.steam_id,
        },
      });
    }

    lse.team = team || null;
    lse.indexInTeam = index;
    await this.lobbySlotEntityRepository.save(lse);

    return this.getLobby(id, user).then((lobby) => {
      this.ebus.publish(new LobbyUpdatedEvent(lobby));
      return lobby;
    });
  }

  public async allLobbies(): Promise<LobbyEntity[]> {
    return this.lobbyEntityRepository.find();
  }

  public async leaveLobbyIfAny(steamId: string) {
    const lse = await this.lobbySlotEntityRepository.findOne({
      where: {
        steamId,
      },
    });
    if (lse) {
      await this.lobbySlotEntityRepository.delete(lse);
      this.getLobby(lse.lobbyId).then((lobby) =>
        this.ebus.publish(new LobbyUpdatedEvent(lobby)),
      );
    }
  }
}
