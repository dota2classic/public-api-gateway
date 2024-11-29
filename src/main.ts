import { otelSDK } from "./tracer";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import { Transport } from "@nestjs/microservices";
import { INestApplication, Logger, ValidationPipe } from "@nestjs/common";
import { EventBus, QueryBus } from "@nestjs/cqrs";
import { LiveMatchUpdateEvent } from "./gateway/events/gs/live-match-update.event";
import { GetPlayerInfoQueryResult } from "./gateway/queries/GetPlayerInfo/get-player-info-query.result";
import { Dota2Version } from "./gateway/shared-types/dota2version";
import { PlayerId } from "./gateway/shared-types/player-id";
import { GetPlayerInfoQuery } from "./gateway/queries/GetPlayerInfo/get-player-info.query";
import { UserRepository } from "./cache/user/user.repository";
import * as fs from "fs";
import { WinstonWrapper } from "./utils/logger";
import configuration from "./config/configuration";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  // Start SDK before nestjs factory create
  await otelSDK.start();
  const parsedConfig = configuration();
  const config = new ConfigService(parsedConfig);

  const app = await NestFactory.create(AppModule, {
    logger: new WinstonWrapper(
      config.get("fluentbit.host"),
      config.get<number>("fluentbit.port"),
    ),
  });
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
      url: `redis://${config.get("redis.host")}:6379`,
      host: config.get("redis.host"),
      retryAttempts: Infinity,
      retryDelay: 5000,
      password: config.get("redis.password"),
    },
  });

  const elogger = new Logger("EventLogger");
  app.get(EventBus).subscribe((e) => {
    if (e.constructor.name === LiveMatchUpdateEvent.name) return;

    elogger.verbose(e.constructor.name, e);
  });

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  app.enableCors({
    origin: "*",
  });
  // app.use(cookieParser());

  await app.listen(6001);

  await app.startAllMicroservices();

  // await app.get<MainService>(MainService).actualizeServers();

  console.log("Started api gateway");

  // await test(app);
}

async function test(app: INestApplication<any>) {
  // const ids: string[] = shuffle(await app.get(UserRepository).all().then(all => all.map(it => it.id))).slice(0, 500)

  const ids = [
    "1177028171",
    "1316075080",
    "148928588",
    "120980252",
    "59565811",
    "160048904",
    "1840854962",
    "253323011",
    "1247368846",
    "1044738317",
    "116514945",
    "1127420281",
    "176708734",
  ];

  const qbus = await app.get(QueryBus);
  // @ts-ignore
  const results: GetPlayerInfoQueryResult[] = await Promise.all(
    ids.map((it) =>
      qbus.execute(
        new GetPlayerInfoQuery(new PlayerId(it), Dota2Version.Dota_684),
      ),
    ),
  );

  console.log("Result received");
  // @ts-ignore

  const json = JSON.stringify(
    results
      .map((it) =>
        it
          ? {
              ...it,
              name:
                app.get(UserRepository).getSync(it.playerId.value)?.name ||
                "noname",
            }
          : null,
      )
      .filter(Boolean),
    null,
    2,
  );
  fs.writeFileSync("./entries.json", json);
}
bootstrap();
