import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { REDIS_HOST, REDIS_PASSWORD, REDIS_URL } from './utils/env';
import { Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MainService } from './main.service';
import { inspect } from 'util';
import { EventBus } from '@nestjs/cqrs';
import { LiveMatchUpdateEvent } from './gateway/events/gs/live-match-update.event';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');

  const options = new DocumentBuilder()
    .setTitle('Public REST api for dota2classic')
    .setDescription('All stuff')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    deepScanRoutes: true,
  });
  SwaggerModule.setup('api', app, document);

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

  const elogger = new Logger('EventLogger');
  app.get(EventBus).subscribe(e => {
    if (e.constructor.name === LiveMatchUpdateEvent.name) return;

    elogger.log(`${inspect(e)}`);
  });

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  app.enableCors({
    origin: '*',
  });
  // app.use(cookieParser());

  await app.listen(6001);

  await app.startAllMicroservices();

  await app.get<MainService>(MainService).actualizeServers();

  console.log('Started api gateway');
}
bootstrap();
