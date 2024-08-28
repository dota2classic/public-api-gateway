import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { REDIS_HOST, REDIS_PASSWORD, REDIS_URL } from './utils/env';
import { Transport } from '@nestjs/microservices';
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
      host: REDIS_HOST(),
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

  await app.startAllMicroservices();


  await app.get<MainService>(MainService).actualizeServers();

  console.log("Started api gateway")
}
bootstrap();
