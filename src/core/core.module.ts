import { Global, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import {
  ClientsModule,
  RedisOptions,
  RmqOptions,
  Transport,
} from "@nestjs/microservices";
import { RedlockModule } from "@dota2classic/redlock";
import { RedlockModuleOptions } from "@dota2classic/redlock/dist/redlock.module-definition";
import Redis from "ioredis";
import { RabbitMQConfig, RabbitMQModule } from "@golevelup/nestjs-rabbitmq";

@Global()
@Module({
  imports: [
    CqrsModule,
    JwtModule.registerAsync({
      useFactory(config: ConfigService): JwtModuleOptions {
        return {
          secret: config.get("api.jwtSecret"),
          signOptions: { expiresIn: "100 days" },
        };
      },
      inject: [ConfigService],
    }),
    RedlockModule.registerAsync({
      inject: [ConfigService],
      useFactory(config: ConfigService): RedlockModuleOptions {
        return {
          host: config.get("redis.host"),
          password: config.get("redis.password"),
          port: parseInt(config.get("redis.port")) || 6379,
          options: {
            driftFactor: 0.01,
            retryCount: 0,
            automaticExtensionThreshold: 500,
          },
        };
      },
    }),
    ClientsModule.registerAsync([
      {
        name: "QueryCore",
        useFactory(config: ConfigService): RedisOptions {
          return {
            transport: Transport.REDIS,
            options: {
              host: config.get("redis.host"),
              password: config.get("redis.password"),
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
    RabbitMQModule.forRootAsync({
      useFactory(config: ConfigService): RabbitMQConfig {
        return {
          exchanges: [{ name: "app.events", type: "topic" }],
          enableControllerDiscovery: true,
          uri: `amqp://${config.get("rabbitmq.user")}:${config.get("rabbitmq.password")}@${config.get("rabbitmq.host")}:${config.get("rabbitmq.port")}`,
        };
      },
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync([
      {
        name: "PaymentQueue",
        useFactory(config: ConfigService): RmqOptions {
          return {
            transport: Transport.RMQ,
            options: {
              urls: [
                {
                  hostname: config.get<string>("rabbitmq.host"),
                  port: config.get<number>("rabbitmq.port"),
                  protocol: "amqp",
                  username: config.get<string>("rabbitmq.user"),
                  password: config.get<string>("rabbitmq.password"),
                },
              ],
              queue: config.get<string>("rabbitmq.payment_queue"),
              queueOptions: {
                durable: true,
              },
              prefetchCount: 5,
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [
    {
      provide: "REDIS",
      useFactory: async (config: ConfigService) => {
        return new Redis(6379, config.get("redis.host"), {
          password: config.get("redis.password"),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [
    CqrsModule,
    JwtModule,
    RedlockModule,
    RabbitMQModule,
    ClientsModule,
    "REDIS",
  ],
})
export class CoreModule {}
