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

describe("LobbyController", () => {
  jest.setTimeout(60000);

  let container: StartedPostgreSqlContainer;
  let module: TestingModule;
  let app: NestApplication;

  let controller: LobbyController;
  let mapper: LobbyMapper;

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

  it("GET /:id", async () => {
    const ls = module.get(LobbyService);
    const currentUser = {
      steam_id: "12345",
      roles: [],
    } as CurrentUserDto;
    const lobby = await ls.createLobby(currentUser);

    const js = module.get(AuthService);
    const token = await js.createToken(
      currentUser.steam_id,
      undefined,
      undefined,
    );

    await request(app.getHttpServer())
      .get(`/lobby/${lobby.id}`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .expect(JSON.stringify(await mapper.mapLobby(lobby)));
  });
});
