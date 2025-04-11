import { otelSDK } from "./tracer";
import "./utils/promise";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import { Transport } from "@nestjs/microservices";
import { INestApplication, Logger, ValidationPipe } from "@nestjs/common";
import { EventBus } from "@nestjs/cqrs";
import { LiveMatchUpdateEvent } from "./gateway/events/gs/live-match-update.event";
import { WinstonWrapper } from "./utils/logger";
import configuration from "./config/configuration";
import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";
import { getS3ConnectionToken, S3 } from "nestjs-s3";
import { EntityNotFoundErrorFilter } from "./middleware/typeorm-error-filter";

// import duration from 'dayjs/plugin/duration' // ES 2015

async function bootstrap() {
  // Start SDK before nestjs factory create
  await otelSDK.start();
  const parsedConfig = configuration();
  const config = new ConfigService(parsedConfig);

  const app = await NestFactory.create(AppModule, {
    logger: new WinstonWrapper(
      config.get("fluentbit.host"),
      config.get<number>("fluentbit.port"),
      config.get<boolean>("fluentbit.disabled"),
    ),
  });
  app.setGlobalPrefix("v1");
  app.useGlobalFilters(new EntityNotFoundErrorFilter());

  const options = new DocumentBuilder()
    .setTitle("Public REST api for dota2classic")
    .setDescription("All stuff")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
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
  await tmp2(app);
  // await tmp(app);
}

async function tmp2(app: INestApplication<any>) {
  // console.log(await app.get(NotificationService).getNotifications('116514945'))
}

async function tmp(app: INestApplication<any>) {
  const ds = app.get(DataSource);
  const ids: { id: number }[] = await ds.query(`select fm.id::int
from finished_match fm
where fm.id > 16500 and fm.id < 20000 and fm.matchmaking_mode = 7`);

  const s3: S3 = app.get(getS3ConnectionToken(undefined));

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i].id;
    try {
      await s3.deleteObject({
        Bucket: "replays",
        Key: `${id}.dem`,
      });
    } catch (e) {
      console.error(e);
    }

    console.log(`${i} / ${ids.length} Done`);
  }
}
bootstrap();
