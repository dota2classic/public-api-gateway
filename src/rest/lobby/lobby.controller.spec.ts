import { Test, TestingModule } from "@nestjs/testing";
import { LobbySlotEntity } from "../../entity/lobby-slot.entity";
import { LobbyEntity } from "../../entity/lobby.entity";
import { LobbyController } from "./lobby.controller";
import { LobbyService } from "./lobby.service";
import { LobbyMapper } from "./lobby.mapper";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { NestApplication } from "@nestjs/core";
import { CurrentUserDto } from "../../utils/decorator/current-user";
import * as request from "supertest";
import { AuthService } from "../auth/auth.service";
import { LobbyDto, UpdateLobbyDto } from "./lobby.dto";
import { Role } from "../../gateway/shared-types/roles";
import { Dota_GameMode } from "../../gateway/shared-types/dota-game-mode";
import { UserRepository } from "../../cache/user/user.repository";
import { UserModel } from "../../cache/user/user.model";
import { EventBus, QueryBus } from "@nestjs/cqrs";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { JwtStrategy } from "../strategy/jwt.strategy";
import { MatchPlayer } from "../../gateway/events/room-ready.event";
import { MatchmakingMode } from "../../gateway/shared-types/matchmaking-mode";
import { PlayerId } from "../../gateway/shared-types/player-id";
import { Dota2Version } from "../../gateway/shared-types/dota2version";
import { LobbyReadyEvent } from "../../gateway/events/lobby-ready.event";
import { Repository } from "typeorm";
import { DotaTeam } from "../../gateway/shared-types/dota-team";
import { Dota_Map } from "../../gateway/shared-types/dota-map";

describe("LobbyController", () => {
  jest.setTimeout(60000);

  let container: StartedPostgreSqlContainer;
  let module: TestingModule;
  let app: NestApplication;

  let controller: LobbyController;
  let mapper: LobbyMapper;

  let urep = new UserRepository(undefined);

  const createUser = async (
    steamId: string,
    roles: Role[] = [],
  ): Promise<[CurrentUserDto, string]> => {
    const currentUser = {
      steam_id: steamId,
      roles: roles,
    } as CurrentUserDto;

    const js = module.get(AuthService);
    const ue = module.get(UserRepository);
    const authSpy = jest
      .spyOn(ue, "resolve")
      .mockReturnValueOnce(
        Promise.resolve(new UserModel(steamId, "", "", roles)),
      );

    const token = await js.createToken(
      currentUser.steam_id,
      undefined,
      undefined,
    );

    return [currentUser, token];
  };

  beforeAll(async () => {
    container = await new PostgreSqlContainer()
      .withUsername("username")
      .withPassword("password")
      .start();

    const Entities = [LobbyEntity, LobbySlotEntity];

    module = await Test.createTestingModule({
      imports: [
        await ConfigModule.forRoot({
          load: [() => ({ api: { jwtSecret: "notasecret" } })],
        }),
        TypeOrmModule.forRoot({
          host: container.getHost(),
          port: container.getFirstMappedPort(),

          type: "postgres",
          database: "postgres",

          username: container.getUsername(),
          password: container.getPassword(),
          entities: Entities,
          synchronize: true,
          dropSchema: false,
          ssl: false,
        }),
        TypeOrmModule.forFeature(Entities),
        JwtModule.register({
          secret: "notasecret",
          signOptions: { expiresIn: "100 days" },
        }),
      ],
      controllers: [LobbyController],
      providers: [
        LobbyService,
        LobbyMapper,
        AuthService,
        JwtStrategy,
        {
          provide: UserRepository,
          useValue: urep,
        },
        {
          provide: EventBus,
          useValue: {
            publish: jest.fn(),
          },
        },
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(LobbyController);
    mapper = module.get(LobbyMapper);
    app = module.createNestApplication();

    urep.resolve = (steamId) =>
      Promise.resolve(new UserModel(steamId, "", "", []));

    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await container.stop();
  });

  it("should spin up", () => {});

  it("POST /:id/join", async () => {
    const ls = module.get(LobbyService);
    const [user, token] = await createUser("12345");
    const lobby = await ls.createLobby(user);

    const [somebody, somebodyToken] = await createUser("55555", []);

    // Non-owner
    await request(app.getHttpServer())
      .post(`/lobby/${lobby.id}/join`)
      .set({ Authorization: `Bearer ${somebodyToken}` })
      .expect(201);

    expect(
      (await ls.getLobby(lobby.id, user)).slots.map((it) => it.steamId).sort(),
    ).toMatchObject([user.steam_id, somebody.steam_id]);
  });

  it("POST /:id/leave as owner", async () => {
    const ls = module.get(LobbyService);
    const [user, token] = await createUser("12345");
    const lobby = await ls.createLobby(user);

    // Owner
    await request(app.getHttpServer())
      .post(`/lobby/${lobby.id}/leave`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(201);

    await expect(ls.getLobby(lobby.id, user)).rejects.toBeDefined();
  });

  it("POST /:id/start as owner", async () => {
    const ls = module.get(LobbyService);
    const ebus = module.get(EventBus);
    const [user, token] = await createUser("12345");
    const lobby = await ls.createLobby(user);

    const [somebody, somebodyToken] = await createUser("55555", []);

    const lser: Repository<LobbySlotEntity> = module.get(
      getRepositoryToken(LobbySlotEntity),
    );
    const lse = new LobbySlotEntity(lobby.id, somebody.steam_id);
    lse.team = DotaTeam.RADIANT;
    await lser.save(lse);

    // Owner
    await request(app.getHttpServer())
      .post(`/lobby/${lobby.id}/start`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(201);

    // Should delete lobby
    await expect(ls.getLobby(lobby.id, user)).rejects.toBeDefined();

    expect(ebus.publish).toBeCalledTimes(1);
    expect(ebus.publish).toBeCalledWith(
      new LobbyReadyEvent(
        lobby.id,
        MatchmakingMode.LOBBY,
        lobby.map,
        lobby.gameMode,
        [
          new MatchPlayer(
            new PlayerId(lse.steamId),
            DotaTeam.RADIANT,
            lse.steamId,
          ),
        ],
        Dota2Version.Dota_684,
      ),
    );
  });

  it("POST /:id/changeTeam", async () => {
    const ls = module.get(LobbyService);
    const [user, token] = await createUser("12345");
    const lobby = await ls.createLobby(user);

    const [somebody, somebodyToken] = await createUser("55555", []);

    const lser = module.get(getRepositoryToken(LobbySlotEntity));
    await lser.save(new LobbySlotEntity(lobby.id, somebody.steam_id));

    // Make team set
    await request(app.getHttpServer())
      .post(`/lobby/${lobby.id}/changeTeam`)
      .send({ team: DotaTeam.DIRE })
      .set({ Authorization: `Bearer ${somebodyToken}` })
      .expect(201)
      .expect((res) =>
        expect(
          (res.body as LobbyDto).slots.find(
            (t) => t.user.steamId === somebody.steam_id,
          )?.team,
        ).toEqual(DotaTeam.DIRE),
      );

    // Make team unset
    await request(app.getHttpServer())
      .post(`/lobby/${lobby.id}/changeTeam`)
      .send({ team: undefined })
      .set({ Authorization: `Bearer ${somebodyToken}` })
      .expect(201)
      .expect((res) =>
        expect(
          (res.body as LobbyDto).slots.find(
            (t) => t.user.steamId === somebody.steam_id,
          )?.team,
        ).toEqual(null),
      );
  });

  it("POST /:id/leave as member", async () => {
    const ls = module.get(LobbyService);
    const [user, token] = await createUser("12345");
    const lobby = await ls.createLobby(user);

    const [somebody, somebodyToken] = await createUser("55555", []);

    const lser = module.get(getRepositoryToken(LobbySlotEntity));
    await lser.save(new LobbySlotEntity(lobby.id, somebody.steam_id));

    // Non-owner
    await request(app.getHttpServer())
      .post(`/lobby/${lobby.id}/leave`)
      .set({ Authorization: `Bearer ${somebodyToken}` })
      .expect(201);

    expect(
      (await ls.getLobby(lobby.id, user)).slots.map((it) => it.steamId).sort(),
    ).toMatchObject([user.steam_id]);
  });

  it("DELETE /:id as non-owner", async () => {
    const ls = module.get(LobbyService);
    const [user, token] = await createUser("12345");
    const lobby = await ls.createLobby(user);

    const [somebody, somebodyToken] = await createUser("5555", []);

    // Non-owner
    await request(app.getHttpServer())
      .delete(`/lobby/${lobby.id}`)
      .set({ Authorization: `Bearer ${somebodyToken}` })
      .expect(403);
  });

  it("DELETE /:id as owner", async () => {
    const ls = module.get(LobbyService);
    const [user, token] = await createUser("12345");
    const lobby = await ls.createLobby(user);

    // Owner
    await request(app.getHttpServer())
      .delete(`/lobby/${lobby.id}`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(200);
  });

  it("DELETE /:id as moderator", async () => {
    const ls = module.get(LobbyService);
    const [user, token] = await createUser("12345");
    const lobby = await ls.createLobby(user);

    const [rootUser, rootToken] = await createUser("12345", [Role.MODERATOR]);

    // Non-owner
    await request(app.getHttpServer())
      .delete(`/lobby/${lobby.id}`)
      .set({ Authorization: `Bearer ${rootToken}` })
      .expect(200);
  });

  it("POST / as moderator", async () => {
    const [user, token] = await createUser("13245", [Role.MODERATOR]);

    await request(app.getHttpServer())
      .post(`/lobby`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(201)
      .expect((res) =>
        expect(res.body).toMatchObject({
          gameMode: Dota_GameMode.ALLPICK,
          map: Dota_Map.DOTA,
          slots: [{ user: { steamId: user.steam_id } }] as any[],
        } satisfies Partial<LobbyDto>),
      );
  });

  it("POST / as non-moderator", async () => {
    const [user, token] = await createUser("13245");

    await request(app.getHttpServer())
      .post(`/lobby`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(403);
  });

  it("GET /:id", async () => {
    const ls = module.get(LobbyService);
    const [user, token] = await createUser("12345");
    const lobby = await ls.createLobby(user);

    await request(app.getHttpServer())
      .get(`/lobby/${lobby.id}`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .expect(JSON.stringify(await mapper.mapLobby(lobby)));
  });

  it("PATCH /:id", async () => {
    const ls = module.get(LobbyService);
    const [user, token] = await createUser("12345");
    const lobby = await ls.createLobby(user);

    await request(app.getHttpServer())
      .patch(`/lobby/${lobby.id}`)
      .set({ Authorization: `Bearer ${token}` })
      .send({
        map: Dota_Map.DIRETIDE,
        gameMode: Dota_GameMode.CAPTAINS_MODE,
      } satisfies UpdateLobbyDto)
      .expect(200)
      .expect(
        JSON.stringify(
          await mapper.mapLobby({
            ...lobby,
            map: Dota_Map.DIRETIDE,
            gameMode: Dota_GameMode.CAPTAINS_MODE,
          }),
        ),
      );
  });
});
