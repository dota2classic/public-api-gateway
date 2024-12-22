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
import { AppModule } from "../../app.module";
import { AuthService } from "../auth/auth.service";
import { LobbyDto } from "./lobby.dto";
import { Role } from "../../gateway/shared-types/roles";
import { Dota_GameMode } from "../../gateway/shared-types/dota-game-mode";
import { UserRepository } from "../../cache/user/user.repository";
import { UserModel } from "../../cache/user/user.model";

describe("LobbyController", () => {
  jest.setTimeout(60000);

  let container: StartedPostgreSqlContainer;
  let module: TestingModule;
  let app: NestApplication;

  let controller: LobbyController;
  let mapper: LobbyMapper;

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
      imports: [AppModule],
    }).compile();

    controller = module.get(LobbyController);
    mapper = module.get(LobbyMapper);
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await container.stop();
  });

  it("should spin up", () => {});

  it("POST / as moderator", async () => {
    const [user, token] = await createUser("13245", [Role.MODERATOR]);

    await request(app.getHttpServer())
      .post(`/lobby`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(201)
      .expect((res) =>
        expect(res.body).toMatchObject({
          gameMode: Dota_GameMode.ALLPICK,
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
});
