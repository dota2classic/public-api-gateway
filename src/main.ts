import "./utils/promise";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import { Transport } from "@nestjs/microservices";
import { ValidationPipe } from "@nestjs/common";
import configuration from "./config/configuration";
import { ConfigService } from "@nestjs/config";
import { EntityNotFoundErrorFilter } from "./middleware/typeorm-error-filter";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import fastifyCookie from "@fastify/cookie";
import fastify from "fastify";
import fastyfyMultipart from "@fastify/multipart";

async function bootstrap() {
  const parsedConfig = configuration();
  const config = new ConfigService(parsedConfig);

  console.log(parsedConfig);

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(
      fastify({
        trustProxy: true,
        bodyLimit: 1024 * 1024 * 20, // 20 MB
      }),
    ),
    {
      logger: new WinstonWrapper(
        config.get("fluentbit.host"),
        config.get<number>("fluentbit.port"),
        config.get<string>("fluentbit.application"),
        config.get<boolean>("fluentbit.disabled"),
        config.get<boolean>("fluentbit.noStdout"),
      ),
    },
  );
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

  app
    .getHttpAdapter()
    .getInstance()
    .decorateReply("setHeader", function (key, value) {
      this.raw.setHeader(key, value);
    });
  app
    .getHttpAdapter()
    .getInstance()
    .decorateReply("end", function () {
      this.raw.end();
    });

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

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  app.enableCors({
    origin: "*",
  });

  // Register fastify-cookie plugin
  await app.register(fastifyCookie);
  await app.register(fastyfyMultipart);

  await app.listen(6001, "0.0.0.0");

  await app.startAllMicroservices();
}

bootstrap();
