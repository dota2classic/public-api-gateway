import {
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { LobbyEntity } from "../../entity/lobby.entity";
import { LobbySlotEntity } from "../../entity/lobby-slot.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, IsNull, Repository } from "typeorm";
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
import { shuffle } from "../../utils/shuffle";
import { ClientProxy } from "@nestjs/microservices";
import { PlayerApi } from "../../generated-api/gameserver";
import { LobbyAction } from "./lobby.dto";
import { PlayerLeaveQueueRequestedEvent } from "../../gateway/events/mm/player-leave-queue-requested.event";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { DotaPatch } from "../../gateway/constants/patch";
import { Region } from "../../gateway/shared-types/region";

@Injectable()
export class LobbyService {
  private logger = new Logger(LobbyService.name);

  constructor(
    @InjectRepository(LobbyEntity)
    private readonly lobbyEntityRepository: Repository<LobbyEntity>,
    @InjectRepository(LobbySlotEntity)
    private readonly lobbySlotEntityRepository: Repository<LobbySlotEntity>,
    private readonly datasource: DataSource,
    private readonly ebus: EventBus,
    @Inject("QueryCore") private readonly redisEventQueue: ClientProxy,
    private ms: PlayerApi,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  public async createLobby(user: CurrentUserDto): Promise<LobbyEntity> {
    // If not mod and in game => bad!
    if (!this.isModerator(user) && (await this.isInGame(user.steam_id))) {
      throw new HttpException("Нельзя создавать лобби находясь в игре!", 403);
    }

    // Leave from all lobbies
    const lobbies = await this.lobbySlotEntityRepository.find({
      where: { steamId: user.steam_id },
    });
    await Promise.all(
      lobbies.map((lobby) => this.leaveLobby(lobby.lobbyId, user)),
    );
    // Delete all hosted lobbies
    const hostedLobbies = await this.lobbyEntityRepository.find({
      where: { ownerSteamId: user.steam_id },
    });
    await Promise.all(
      hostedLobbies.map((l) => this.closeLobby(l.id, user, LobbyAction.Close)),
    );

    const lobby = await this.datasource.transaction(async (tx) => {
      // Create lobby entity
      let lobby = new LobbyEntity(user.steam_id);
      await tx.save(LobbyEntity, lobby);

      const slots: LobbySlotEntity[] = [];

      let leaderAssigned: boolean = false;
      // populate team slots
      for (const team of [DotaTeam.RADIANT, DotaTeam.DIRE]) {
        for (let i = 0; i < 5; i++) {
          const lse = new LobbySlotEntity(lobby.id, team, i);
          if (!leaderAssigned) {
            leaderAssigned = true;
            lse.steamId = user.steam_id;
          }
          slots.push(lse);
        }
      }
      // Populate unassigned slots
      for (let i = 0; i < 20; i++) {
        slots.push(new LobbySlotEntity(lobby.id, undefined, i));
      }

      await tx.insert(LobbySlotEntity, slots);

      return lobby;
    });

    return this.getLobby(lobby.id, user).then(this.lobbyUpdated);
  }

  public async getLobby(
    id: string,
    askedBy?: CurrentUserDto,
  ): Promise<LobbyEntity> {
    const lobby = await this.lobbyEntityRepository.findOneOrFail({
      where: { id },
    });

    if (!askedBy) return lobby;

    const isParticipant =
      lobby.slots.findIndex((t) => t.steamId === askedBy.steam_id) !== -1;

    if (!isParticipant) {
      throw new ForbiddenException();
    }

    return lobby;
  }

  public async joinLobby(
    id: string,
    user: CurrentUserDto,
    password: string,
  ): Promise<LobbyEntity> {
    if (!this.isModerator(user) && (await this.isInGame(user.steam_id))) {
      throw new HttpException("Нельзя заходить в лобби находясь в игре!", 403);
    }

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

    if (lobby.password !== null && lobby.password !== password) {
      throw new ForbiddenException("Wrong password");
    }

    const freeSlot = lobby.slots.find(
      (t) => t.lobbyId === lobby.id && !t.steamId && !t.team,
    );
    if (!freeSlot) {
      throw new ForbiddenException("Нет свободных мест!");
    }

    freeSlot.steamId = user.steam_id;
    await this.lobbySlotEntityRepository.save(freeSlot);

    this.lobbyUpdated(lobby);

    await this.leaveAllQueues(user.steam_id);

    return lobby;
  }

  //
  public async closeLobby(
    id: string,
    user: CurrentUserDto,
    withAction: LobbyAction,
  ) {
    let q = this.lobbyEntityRepository
      .createQueryBuilder("l")
      .where("l.id = :id", { id })
      .leftJoinAndSelect("l.slots", "slots");

    // If casual player, need to check permissions
    if (!this.isModerator(user)) {
      q = q.andWhere({
        ownerSteamId: user.steam_id,
      });
    }

    try {
      await this.datasource.transaction(async (em) => {
        const lobby = await q.getOneOrFail();
        const affected = lobby.slots.map((t) => t.steamId);
        const lobbyId = lobby.id;
        await em.remove(lobby.slots);

        await em.remove(lobby);
        this.redisEventQueue.emit(
          LobbyUpdatedEvent.name,
          new LobbyUpdatedEvent(withAction, affected, lobbyId),
        );
        this.logger.log("Closed lobby", { lobby_id: id });
      });
    } catch (e) {
      console.error(e);
      throw new HttpException("Not an owner", HttpStatusCode.Forbidden);
    }
  }

  public async leaveLobby(id: string, user: CurrentUserDto): Promise<void> {
    const lobby = await this.lobbyEntityRepository.findOneOrFail({
      where: { id },
    });

    const slot = lobby.slots.find((slot) => slot.steamId === user.steam_id);

    if (!slot) {
      throw new HttpException("Not in lobby", HttpStatusCode.Conflict);
    }

    // If we are owner, close lobby as well
    if (lobby.ownerSteamId === user.steam_id) {
      return this.closeLobby(id, user, LobbyAction.Close);
    }

    await this.lobbySlotEntityRepository.update(
      {
        steamId: user.steam_id,
        lobbyId: lobby.id,
      },
      {
        steamId: null,
      },
    );

    // emit evt
    slot.steamId = undefined;
    await this.redisEventQueue.emit(
      LobbyUpdatedEvent.name,
      new LobbyUpdatedEvent(
        LobbyAction.Kick,
        [user.steam_id],
        lobby.id,
        lobby,
        [user.steam_id],
      ),
    );

    this.lobbyUpdated(lobby);
  }

  public async updateLobby(
    id: string,
    user: CurrentUserDto,
    gameMode: Dota_GameMode | undefined,
    map: Dota_Map | undefined,
    password: string,
    name: string,
    enableCheats: boolean,
    fillBots: boolean,
    patch: DotaPatch,
    region?: Region,
    noRunes?: boolean,
    midTowerToWin?: boolean,
    midTowerKillsToWin?: number,
  ): Promise<LobbyEntity> {
    let lobby = await this.getLobby(id, user);

    if (lobby.ownerSteamId !== user.steam_id) {
      throw new ForbiddenException(
        "Only lobby owner allowed to change lobby settings",
      );
    }

    lobby.gameMode = gameMode;
    lobby.map = map;
    lobby.password = password;
    lobby.name = name;
    lobby.fillBots = fillBots;
    lobby.enableCheats = enableCheats;
    lobby.patch = patch;
    lobby.region = region;
    lobby.disableRunes = noRunes;
    lobby.midTowerToWin = midTowerToWin;
    lobby.killsToWin = midTowerKillsToWin;

    await this.lobbyEntityRepository.save(lobby);

    return this.getLobby(id, user).then(this.lobbyUpdated);
  }

  public async kickPlayer(
    lobbyId: string,
    user: CurrentUserDto,
    steamId: string,
  ) {
    const lobby = await this.getLobby(lobbyId, user);
    if (lobby.ownerSteamId !== user.steam_id) {
      throw new ForbiddenException("Only lobby owner can kick players");
    }

    await this.leaveLobby(lobbyId, { steam_id: steamId, roles: [] });

    return this.getLobby(lobbyId, user).then(this.lobbyUpdated);
  }

  async shuffleLobby(id: string, user: CurrentUserDto) {
    const lobby = await this.getLobby(id, user);
    if (lobby.ownerSteamId !== user.steam_id) {
      throw new ForbiddenException("Only lobby owner can shuffle teams");
    }

    await this.datasource.transaction(async (tx) => {
      // Find all team slots of lobby for update
      const slots = await tx
        .createQueryBuilder<LobbySlotEntity>(LobbySlotEntity, "slot")
        .useTransaction(true)
        .setLock("pessimistic_write")
        .where("slot.lobby_id = :lobbyId", { lobbyId: lobby.id })
        .andWhere("slot.team IS NOT NULL")
        .getMany();

      // Create pool of players
      let playerPool = Array.from(
        new Set(slots.filter((t) => t.steamId).map((t) => t.steamId)),
      );
      playerPool = shuffle(playerPool);

      // Clean them up
      slots.forEach((slot) => (slot.steamId = null));

      // Assign player pool
      for (let i = 0; i < Math.min(10, playerPool.length); i++) {
        const indexInTeam = Math.floor(i / 2);
        const team = i % 2 === 0 ? DotaTeam.RADIANT : DotaTeam.DIRE;
        const slot = slots.find(
          (t) => t.team === team && t.indexInTeam === indexInTeam,
        );
        slot.steamId = playerPool[i];
      }

      // Save slots
      await tx.save(LobbySlotEntity, slots);
    });

    return this.getLobby(id, user).then(this.lobbyUpdated);
  }

  // TODO: make start only by owner
  public async startLobby(id: string, user: CurrentUserDto) {
    const lobby = await this.getLobby(id, user);

    const filledSlots = lobby.slots.filter((it) => it.team && it.steamId);
    if (filledSlots.length === 0) {
      throw new HttpException(
        "Lobby must have at least 1 player in any team",
        HttpStatusCode.BadRequest,
      );
    }

    // We need a lock for this maybe??

    await this.closeLobby(id, user, LobbyAction.Start).then(async () => {
      this.logger.log("Closed lobby, emitting lobby ready event");

      const evt = new LobbyReadyEvent(
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
        lobby.fillBots,
        lobby.enableCheats,
        lobby.patch,
        lobby.region,
        lobby.disableRunes,
        lobby.midTowerToWin,
        lobby.killsToWin,
      );

      await this.amqpConnection.publish(
        "app.events",
        LobbyReadyEvent.name,
        evt,
      );

      await this.redisEventQueue.emit(LobbyReadyEvent.name, evt).toPromise();
    });
  }

  public async changeTeam(
    id: string,
    user: CurrentUserDto,
    steamId: string | undefined,
    team: DotaTeam | undefined,
    index: number,
  ): Promise<LobbyEntity> {
    const lobby = await this.getLobby(id, user);

    let playerInLobby = false;
    if (steamId) {
      if (user.steam_id !== lobby.ownerSteamId && user.steam_id !== steamId) {
        throw new ForbiddenException(
          "Only moderator or admin can manage players in lobby, or the player itself",
        );
      }
      playerInLobby = await this.lobbySlotEntityRepository.exists({
        where: {
          lobbyId: id,
          steamId: steamId,
        },
      });
    } else {
      playerInLobby = await this.lobbySlotEntityRepository.exists({
        where: {
          lobbyId: id,
          steamId: user.steam_id,
        },
      });
    }

    if (!playerInLobby) {
      throw new NotFoundException("Player not in lobby");
    }

    // move player
    await this.datasource.transaction(async (tx) => {
      // Free previous slots
      await tx.update<LobbySlotEntity>(
        LobbySlotEntity,
        {
          lobbyId: lobby.id,
          steamId: user.steam_id,
        },
        { steamId: null },
      );

      // Extra logic for "unassigned" team
      if (!team) {
        const freeIndex = await tx.findOne<LobbySlotEntity>(LobbySlotEntity, {
          where: {
            lobbyId: lobby.id,
            team: null,
            steamId: undefined,
          },
        });
        index = freeIndex.indexInTeam;
      }

      const upd = await tx.update<LobbySlotEntity>(
        LobbySlotEntity,
        {
          lobbyId: lobby.id,
          team: team ? team : IsNull(),
          indexInTeam: index,
        },
        {
          steamId: user.steam_id,
        },
      );

      if (!upd.affected) {
        throw new NotFoundException("Target slot not found!");
      }
    });

    return this.getLobby(id, user).then(this.lobbyUpdated);
  }

  public async getLobbyOf(steamId: string) {
    return this.lobbySlotEntityRepository.findOne({
      where: {
        steamId,
      },
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
      await this.leaveLobby(lse.lobbyId, { steam_id: steamId, roles: [] });
    }
  }

  private lobbyUpdated = (lobby: LobbyEntity): LobbyEntity => {
    this.redisEventQueue.emit(
      LobbyUpdatedEvent.name,
      new LobbyUpdatedEvent(
        LobbyAction.Update,
        lobby.slots.map((t) => t.steamId),
        lobby.id,
        lobby,
      ),
    );
    return lobby;
  };

  private isModerator(user: CurrentUserDto) {
    return (
      user.roles.includes(Role.ADMIN) || user.roles.includes(Role.MODERATOR)
    );
  }

  private async isInGame(steamId: string) {
    try {
      return this.ms
        .playerControllerPlayerSummary(steamId)
        .then((t) => !!t.session);
    } catch (e) {
      this.logger.error("Error getting summary", e);
      return true;
    }
  }

  private async leaveAllQueues(steamId: string) {
    await this.redisEventQueue
      .emit(
        PlayerLeaveQueueRequestedEvent.name,
        new PlayerLeaveQueueRequestedEvent(steamId),
      )
      .toPromise();
  }
}
