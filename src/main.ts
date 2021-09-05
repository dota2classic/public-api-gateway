import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UserRepository } from './cache/user/user.repository';
import * as cookieParser from 'cookie-parser';
import { CACHE_MANAGER, Logger } from '@nestjs/common';
import { REDIS_PASSWORD, REDIS_URL } from './utils/env';
import { Transport } from '@nestjs/microservices';
import * as request from 'supertest';
import { inspect } from "util";
import { Subscriber } from 'rxjs';
import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import { GetAllQuery } from './gateway/queries/GetAll/get-all.query';
import { GetAllQueryResult } from './gateway/queries/GetAll/get-all-query.result';
import { UserModel } from './cache/user/user.model';
import { MainService } from './main.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');

  const options = new DocumentBuilder()
    .setTitle('Public REST api for dota2classic')
    .setDescription('All stuff')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.connectMicroservice({
    transport: Transport.REDIS,
    options: {
      url: REDIS_URL(),
      retryAttempts: Infinity,
      retryDelay: 5000,
      password: REDIS_PASSWORD(),
    },
  });
  app.use(cookieParser());

  app.enableCors({
    origin: '*',
  });
  // app.use(cookieParser());

  await app.listen(6001);

  await app.startAllMicroservicesAsync();

  // await app.get(UserRepository).fillCaches();



  const ebus = app.get(EventBus);
  const cbus = app.get(CommandBus);
  const qbus = app.get(QueryBus);

  const clogger = new Logger('CommandLogger');
  const elogger = new Logger('EventLogger');
  const qlogger = new Logger('QueryLogger');


  await app.get<MainService>(MainService).actualizeServers();

  // ebus._subscribe(
  //   new Subscriber<any>(e => {
  //
  //     elogger.log(
  //       // `${inspect(e)}`,
  //       e.__proto__.constructor.name,
  //     );
  //   }),
  // );
  //
  //
  // cbus._subscribe(
  //   new Subscriber<any>(e => {
  //     clogger.log(`${inspect(e)}, ${e.__proto__.constructor.name}`);
  //   }),
  // );
  //
  // qbus._subscribe(
  //   new Subscriber<any>(e => {
  //     qlogger.log(e.__proto__.constructor.name);
  //   }),
  // );


  console.log("Started api gateway")
}
bootstrap();
