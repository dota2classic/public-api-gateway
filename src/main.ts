import { otelSDK } from "./tracer";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import { REDIS_HOST, REDIS_PASSWORD, REDIS_URL } from "./utils/env";
import { Transport } from "@nestjs/microservices";
import { INestApplication, Logger, ValidationPipe } from "@nestjs/common";
import { MainService } from "./main.service";
import { inspect } from "util";
import { EventBus, QueryBus } from "@nestjs/cqrs";
import { LiveMatchUpdateEvent } from "./gateway/events/gs/live-match-update.event";
import { GetPlayerInfoQueryResult } from "./gateway/queries/GetPlayerInfo/get-player-info-query.result";
import { Dota2Version } from "./gateway/shared-types/dota2version";
import { GetPlayerInfoQuery } from "./gateway/queries/GetPlayerInfo/get-player-info.query";
import { GetUserInfoQuery } from "./gateway/queries/GetUserInfo/get-user-info.query";
import { GetUserInfoQueryResult } from "./gateway/queries/GetUserInfo/get-user-info-query.result";

async function bootstrap() {
  // Start SDK before nestjs factory create
  await otelSDK.start();

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("v1");

  const options = new DocumentBuilder()
    .setTitle("Public REST api for dota2classic")
    .setDescription("All stuff")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    deepScanRoutes: true,
  });
  SwaggerModule.setup("api", app, document);

  app.connectMicroservice({
    transport: Transport.REDIS,
    options: {
      url: REDIS_URL(),
      host: REDIS_HOST(),
      retryAttempts: Infinity,
      retryDelay: 5000,
      password: REDIS_PASSWORD(),
    },
  });

  const elogger = new Logger("EventLogger");
  app.get(EventBus).subscribe((e) => {
    if (e.constructor.name === LiveMatchUpdateEvent.name) return;

    elogger.log(`${inspect(e)}`);
  });

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  app.enableCors({
    origin: "*",
  });
  // app.use(cookieParser());

  await app.listen(6001);

  await app.startAllMicroservices();

  await app.get<MainService>(MainService).actualizeServers();

  console.log("Started api gateway");

  // await test(app);
}

async function test(app: INestApplication<any>) {
  const r = {
    teams: [
      {
        parties: [
          {
            partyID: "5c8925fa-5108-4863-9a0b-fe73c454ebe7",
            mode: 1,
            version: "Dota_684",
            players: [
              {
                playerId: {
                  value: "1177028171",
                },
                balanceScore: 33375.67762276256,
                banStatus: {
                  isBanned: false,
                  bannedUntil: 1731354700057,
                  status: 0,
                },
              },
            ],
            waitingScore: 231,
          },
          {
            partyID: "bb9854af-eff6-4d39-882c-90c6eb62e290",
            mode: 1,
            version: "Dota_684",
            players: [
              {
                playerId: {
                  value: "293008722",
                },
                balanceScore: 20495.557301888897,
                banStatus: {
                  isBanned: false,
                  bannedUntil: 0,
                  status: 2,
                },
              },
            ],
            waitingScore: 28,
          },
          {
            partyID: "a568cf16-a6cc-4353-b30c-c50336548ead",
            mode: 1,
            version: "Dota_684",
            players: [
              {
                playerId: {
                  value: "160048904",
                },
                balanceScore: 8844.112195737333,
                banStatus: {
                  isBanned: false,
                  bannedUntil: 0,
                  status: 2,
                },
              },
            ],
            waitingScore: 425,
          },
          {
            partyID: "deda1571-7d1e-4466-a8e9-b54e8e300d00",
            mode: 1,
            version: "Dota_684",
            players: [
              {
                playerId: {
                  value: "1840854962",
                },
                balanceScore: 4462.496257163448,
                banStatus: {
                  isBanned: false,
                  bannedUntil: 0,
                  status: 2,
                },
              },
            ],
            waitingScore: 37,
          },
          {
            partyID: "fd26e30a-7841-4974-bcb4-c79ddede0866",
            mode: 1,
            version: "Dota_684",
            players: [
              {
                playerId: {
                  value: "1676696474",
                },
                balanceScore: 1744.2082079429897,
                banStatus: {
                  isBanned: false,
                  bannedUntil: 0,
                  status: 2,
                },
              },
            ],
            waitingScore: 36,
          },
        ],
        totalScore: 68922.05158549524,
        averageScore: 13784.410317099047,
      },
      {
        parties: [
          {
            partyID: "b68e6f49-03c1-4889-9f7d-59da05835d5a",
            mode: 1,
            version: "Dota_684",
            players: [
              {
                playerId: {
                  value: "1316075080",
                },
                balanceScore: 28772.871600123417,
                banStatus: {
                  isBanned: false,
                  bannedUntil: 0,
                  status: 2,
                },
              },
            ],
            waitingScore: 325,
          },
          {
            partyID: "abd7c2ba-92fc-4027-9341-94ee1a73e371",
            mode: 1,
            version: "Dota_684",
            players: [
              {
                playerId: {
                  value: "1350458795",
                },
                balanceScore: 23836.31472533996,
                banStatus: {
                  isBanned: false,
                  bannedUntil: 1731428623135,
                  status: 0,
                },
              },
            ],
            waitingScore: 416,
          },
          {
            partyID: "c2dfa32a-0f13-43da-852f-23440e976651",
            mode: 1,
            version: "Dota_684",
            players: [
              {
                playerId: {
                  value: "1126848000",
                },
                balanceScore: 16999.75017531051,
                banStatus: {
                  isBanned: false,
                  bannedUntil: 1731437403932,
                  status: 0,
                },
              },
            ],
            waitingScore: 93,
          },
          {
            partyID: "9731ffb8-b1f8-412c-bc7d-5693d3b6034b",
            mode: 1,
            version: "Dota_684",
            players: [
              {
                playerId: {
                  value: "478507092",
                },
                balanceScore: 1713.1233091875702,
                banStatus: {
                  isBanned: false,
                  bannedUntil: 0,
                  status: 2,
                },
              },
            ],
            waitingScore: 10,
          },
          {
            partyID: "6427e497-3272-441c-97db-961347deff25",
            mode: 1,
            version: "Dota_684",
            players: [
              {
                playerId: {
                  value: "364511887",
                },
                balanceScore: 575.6462732485114,
                banStatus: {
                  isBanned: false,
                  bannedUntil: 0,
                  status: 2,
                },
              },
            ],
            waitingScore: 0,
          },
        ],
        totalScore: 71897.70608320997,
        averageScore: 14379.541216641994,
      },
    ],
  };

  const ids = r.teams
    .flatMap((t) => t.parties)
    .flatMap((t) => t.players)
    .map((it) => it.playerId);

  const qbus = await app.get(QueryBus);
  // @ts-ignore
  const results: GetPlayerInfoQueryResult[] = await Promise.all(
    ids.map((it) =>
      qbus.execute(new GetPlayerInfoQuery(it, Dota2Version.Dota_684)),
    ),
  );
  // @ts-ignore
  const results2: GetUserInfoQueryResult[] = await Promise.all(
    ids.map((it) => qbus.execute(new GetUserInfoQuery(it))),
  );

  console.log(
    JSON.stringify(
      results.map((it) => ({
        ...it,
        name: results2.find((x) => x.id.value === it.playerId.value).name,
      })),
      null,
      2,
    ),
  );
}
bootstrap();
