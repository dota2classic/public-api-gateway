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
import { EventBus, QueryBus } from "@nestjs/cqrs";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { JwtStrategy } from "../strategy/jwt.strategy";
import { IsNull, Repository } from "typeorm";
import { DotaTeam } from "../../gateway/shared-types/dota-team";
import { Dota_Map } from "../../gateway/shared-types/dota-map";
import { UserProfileService } from "../../service/user-profile.service";
import Keyv from "keyv";
import { ClientsModule, RedisOptions, Transport } from "@nestjs/microservices";
import { RedisContainer, StartedRedisContainer } from "@testcontainers/redis";
import {
  RabbitMQContainer,
  StartedRabbitMQContainer,
} from "@testcontainers/rabbitmq";
import { RabbitMQConfig, RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { ApiClient } from "@dota2classic/gs-api-generated/dist/module";
import {
  makeHistogramProvider,
  PrometheusModule,
} from "@willsoto/nestjs-prometheus";
import { ReqLoggingInterceptor } from "../../middleware/req-logging.interceptor";
import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { RoleLifetimeDto } from "../shared.dto";

class MockLoggerInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle();
  }
}

describe("LobbyController", () => {
  jest.setTimeout(60000);

  let container: StartedPostgreSqlContainer;
  let redis: StartedRedisContainer;
  let rabbit: StartedRabbitMQContainer;

  let module: TestingModule;
  let app: NestApplication;

  let controller: LobbyController;
  let mapper: LobbyMapper;

  // @ts-ignore
  let urep = new UserProfileService(
    new Keyv(),
    undefined,
    undefined,
    undefined,
    undefined,
  );

  const createUser = async (
    steamId: string,
    roles: Role[] = [],
  ): Promise<[CurrentUserDto, string]> => {
    const currentUser = {
      steam_id: steamId,
      roles: roles,
    } as CurrentUserDto;

    const js = module.get(AuthService);
    const ue = module.get(UserProfileService);
    const authSpy = jest.spyOn(ue, "userDto").mockReturnValueOnce(
      Promise.resolve({
        steamId,
        avatar: "",
        avatarSmall: "",
        name: "",
        roles: roles.map(
          (t) =>
            ({
              role: t,
              endTime: new Date(Date.now() + 1000000).toISOString(),
            }) satisfies RoleLifetimeDto,
        ),
        connections: [],
      }),
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

    redis = await new RedisContainer("redis:7.4.0-alpine")
      .withPassword("redispass")
      .start();

    rabbit = await new RabbitMQContainer("rabbitmq:management")
      .withEnvironment({
        RABBITMQ_USER: "guest",
        RABBITMQ_PASSWORD: "guest",
      })
      .start();

    const Entities = [LobbyEntity, LobbySlotEntity];

    module = await Test.createTestingModule({
      imports: [
        await ConfigModule.forRoot({
          load: [() => ({ api: { jwtSecret: "notasecret" } })],
        }),
        PrometheusModule.register({
          path: "/metrics",
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
        RabbitMQModule.forRootAsync({
          useFactory(): RabbitMQConfig {
            return {
              exchanges: [
                {
                  name: "app.events",
                  type: "topic",
                },
              ],
              uri: rabbit.getAmqpUrl(),
            };
          },
          imports: [],
          inject: [],
        }),
        ClientsModule.registerAsync([
          {
            name: "QueryCore",
            useFactory(): RedisOptions {
              return {
                transport: Transport.REDIS,
                options: {
                  port: redis.getPort(),
                  host: redis.getHost(),
                  password: redis.getPassword(),
                },
              };
            },
            inject: [],
            imports: [],
          },
        ]),
      ],
      controllers: [LobbyController],
      providers: [
        LobbyService,
        LobbyMapper,
        AuthService,
        JwtStrategy,
        {
          provide: UserProfileService,
          useValue: urep,
        },
        makeHistogramProvider({
          name: "http_requests_duration_seconds",
          help: "Duration of HTTP requests in seconds",
          labelNames: ["method", "route", "request_type", "status_code"],
          buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5], // you can adjust buckets
        }),
        {
          provide: EventBus,
          useValue: {
            publish: jest.fn(),
          },
        },
        {
          provide: ApiClient,
          useValue: {
            player: {
              playerControllerPlayerSummary: () =>
                Promise.resolve({ data: {} }),
            },
          },
        },
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    })
      .overrideInterceptor(ReqLoggingInterceptor)
      .useClass(MockLoggerInterceptor)
      .compile();

    controller = module.get(LobbyController);
    mapper = module.get(LobbyMapper);
    app = module.createNestApplication();

    urep.userDto = (steamId) =>
      Promise.resolve({
        steamId,
        avatar: "",
        avatarSmall: "",
        name: "",
        roles: [],
        connections: [],
      });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await container.stop();
    await redis.stop();
    await rabbit.stop();
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
    ).toEqual(expect.arrayContaining([user.steam_id, somebody.steam_id]));
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

    await lser.update(
      {
        lobbyId: lobby.id,
        team: DotaTeam.DIRE,
        indexInTeam: 0,
      },
      {
        steamId: somebody.steam_id,
      },
    );

    // Owner
    await request(app.getHttpServer())
      .post(`/lobby/${lobby.id}/start`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(201);

    // Should delete lobby
    await expect(ls.getLobby(lobby.id, user)).rejects.toBeDefined();

    // expect(ebus.publish).toBeCalledWith(
    //   new LobbyReadyEvent(
    //     lobby.id,
    //     MatchmakingMode.LOBBY,
    //     lobby.map,
    //     lobby.gameMode,
    //     [
    //       new MatchPlayer(
    //         new PlayerId(user.steam_id),
    //         DotaTeam.RADIANT,
    //         user.steam_id,
    //       ),
    //       new MatchPlayer(
    //         new PlayerId(somebody.steam_id),
    //         DotaTeam.DIRE,
    //         somebody.steam_id,
    //       ),
    //     ],
    //     Dota2Version.Dota_684,
    //     false,
    //     false,
    //     DotaPatch.DOTA_684,
    //   ),
    // );
  });

  it("POST /:id/changeTeam", async () => {
    const ls = module.get(LobbyService);
    const [user, token] = await createUser("12345");
    const lobby = await ls.createLobby(user);

    const [somebody, somebodyToken] = await createUser("55555");

    const lser = module.get(getRepositoryToken(LobbySlotEntity));

    await lser.update(
      {
        lobbyId: lobby.id,
        team: IsNull(),
        indexInTeam: 4,
      },
      {
        steamId: somebody.steam_id,
      },
    );

    // Make team set
    await request(app.getHttpServer())
      .post(`/lobby/${lobby.id}/changeTeam`)
      .send({ team: DotaTeam.DIRE, index: 2 })
      .set({ Authorization: `Bearer ${somebodyToken}` })
      .expect(201)
      .expect((res) => {
        expect(
          (res.body as LobbyDto).slots.find(
            (t) => t.user?.steamId === somebody.steam_id,
          )?.team,
        ).toEqual(DotaTeam.DIRE);
      });

    // Make team unset
    await request(app.getHttpServer())
      .post(`/lobby/${lobby.id}/changeTeam`)
      .send({ team: undefined })
      .set({ Authorization: `Bearer ${somebodyToken}` })
      .expect(201)
      .expect((res) =>
        expect(
          (res.body as LobbyDto).slots.find(
            (t) => t.user?.steamId === somebody.steam_id,
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

    await lser.update(
      {
        lobbyId: lobby.id,
        team: IsNull(),
        indexInTeam: 2,
      },
      {
        steamId: somebody.steam_id,
      },
    );

    // Non-owner
    await request(app.getHttpServer())
      .post(`/lobby/${lobby.id}/leave`)
      .set({ Authorization: `Bearer ${somebodyToken}` })
      .expect(201);

    expect(
      (await ls.getLobby(lobby.id, user)).slots.map((it) => it.steamId).sort(),
    ).toEqual(expect.arrayContaining([user.steam_id]));
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
      .expect((res) => {
        expect(res.body).toMatchObject({
          gameMode: Dota_GameMode.ALLPICK,
          map: Dota_Map.DOTA,
        } satisfies Partial<LobbyDto>);
        expect(res.body.slots).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              user: expect.objectContaining({
                steamId: user.steam_id,
              }),
            }),
          ]),
        );
      });
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
      .expect(JSON.stringify(await mapper.mapLobby(lobby, user.steam_id)));
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
          await mapper.mapLobby(
            {
              ...lobby,
              map: Dota_Map.DIRETIDE,
              gameMode: Dota_GameMode.CAPTAINS_MODE,
            },
            user.steam_id,
          ),
        ),
      );
  });
});
