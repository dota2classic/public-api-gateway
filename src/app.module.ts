import { Module } from "@nestjs/common";
import { GetUserInfoQuery } from "./gateway/queries/GetUserInfo/get-user-info.query";
import { EventController } from "./event.controller";
import { GetAllConnectionsQuery } from "./gateway/queries/GetAllConnections/get-all-connections.query";
import { GetConnectionsQuery } from "./gateway/queries/GetConnections/get-connections.query";
import { GetRoleSubscriptionsQuery } from "./gateway/queries/user/GetRoleSubscriptions/get-role-subscriptions.query";
import { LiveMatchStreamModule } from "./cache/live-match-stream.module";
import { GetPlayerInfoQuery } from "./gateway/queries/GetPlayerInfo/get-player-info.query";
import * as redisStore from "cache-manager-redis-store";
import { UserHttpCacheInterceptor } from "./utils/cache-key-track";
import { GetReportsAvailableQuery } from "./gateway/queries/GetReportsAvailable/get-reports-available.query";
import { ScheduleModule } from "@nestjs/schedule";
import { MainService } from "./main.service";
import { Entities } from "./db.config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { CacheModule, CacheModuleOptions } from "@nestjs/cache-manager";
import { QueryCache } from "./rcache";
import { ThrottlerModule } from "@nestjs/throttler";
import { GetQueueStateQuery } from "./gateway/queries/QueueState/get-queue-state.query";
import { GetPartyInvitationsQuery } from "./gateway/queries/GetPartyInvitations/get-party-invitations.query";
import { ConfigModule, ConfigService } from "@nestjs/config";
import configuration from "./config/configuration";
import { outerQueryNew } from "./utils/outerQueryNew";
import { LobbyModule } from "./lobby/lobby.module";
import { StatsModule } from "./stats/stats.module";
import { ReportModule } from "./report/report.module";
import { AuthModule } from "./auth/auth.module";
import { MetaModule } from "./meta/meta.module";
import { ForumModule } from "./forum/forum.module";
import { S3Module, S3ModuleOptions } from "nestjs-s3";
import { FeedbackModule } from "./feedback/feedback.module";
import { StorageModule } from "./storage/storage.module";
import { BlogpostModule } from "./blogpost/blogpost.module";
import { RecordModule } from "./record/record.module";
import { ApiModule } from "./api/api.module";
import { getTypeormConfig } from "./config/typeorm.config";
import { CustomizationModule } from "./customization/customization.module";
import { UserServicesModule } from "./service/user-services.module";
import { RuleModule } from "./rule/rule.module";
import { RmqController } from "./rmq.controller";
import { MessageCreatedHandler } from "./cache/event-handler/message-created.handler";
import { MatchModule } from "./match/match.module";
import { PlayerModule } from "./player/player.module";
import { TournamentModule } from "./tournament/tournament.module";
import { AdminModule } from "./admin/admin.module";
import { PermaBanGuard } from "./utils/decorator/with-user";
import { GsApiGeneratedModule } from "@dota2classic/gs-api-generated/dist/module";
import { LoggerModule } from "nestjs-pino";
import { MetricsModule } from "./metrics/metrics.module";
import { CoreModule } from "./core/core.module";
import { SocketModule } from "./socket/socket.module";
import { NotificationModule } from "./notification/notification.module";
import { PaymentsModule } from "./payments/payments.module";
import { ItemDropModule } from "./itemdrop/itemdrop.module";

@Module({
  imports: [
    CoreModule,
    MetricsModule,
    RuleModule,
    UserServicesModule,
    BlogpostModule,
    RecordModule,
    SocketModule,
    NotificationModule,
    PaymentsModule,
    ItemDropModule,
    FeedbackModule,
    StorageModule,
    LobbyModule,
    StatsModule,
    ReportModule,
    AuthModule,
    MetaModule,
    ForumModule,
    TournamentModule,
    AdminModule,
    MatchModule,
    PlayerModule,
    CustomizationModule,
    LiveMatchStreamModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: true,
        transport: {
          target: "pino-pretty",
          options: {
            colorize: process.env.NODE_ENV !== "production",
            singleLine: true,
          },
        },
        level: process.env.LOG_LEVEL || "info",
        redact: {
          paths: ["req.headers.authorization", "req.headers.cookie"],
          remove: true,
        },
      },
    }),
    GsApiGeneratedModule.forRootAsync({
      imports: [],
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return {
          baseUrl: config.get("api.gameserverApiUrl"),
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      useFactory(config: ConfigService): TypeOrmModuleOptions {
        return {
          ...getTypeormConfig(config),
          type: "postgres",
          migrations: ["dist/database/migrations/*.*"],
          migrationsRun: true,
          logging: ["error"],
          extra: {
            max: 20, // max number of connections
            min: 4, // minimum number of idle connections
            idleTimeoutMillis: 30000, // close idle clients after 30 seconds
            connectionTimeoutMillis: 5000, // return error after 5s if connection cannot be established
          },
        };
      },
      imports: [],
      inject: [ConfigService],
    }),
    S3Module.forRootAsync({
      useFactory(config: ConfigService): S3ModuleOptions {
        return {
          config: {
            credentials: {
              accessKeyId: config.get("s3.accessKeyId"),
              secretAccessKey: config.get("s3.accessKeySecret"),
            },
            region: "any",
            endpoint: config.get("s3.endpoint"),
            forcePathStyle: true,
          },
        };
      },
      inject: [ConfigService],
      imports: [],
    }),
    ThrottlerModule.forRoot([
      {
        name: "burst",
        ttl: 10_000, // 10 seconds
        limit: 3, // 10 msgs
      },
      {
        name: "long",
        ttl: 60_000,
        limit: 20,
      },
    ]),
    TypeOrmModule.forFeature(Entities),
    ScheduleModule.forRoot(),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory(config: ConfigService): CacheModuleOptions {
        return {
          ttl: 10,
          store: redisStore,
          port: 6379,
          url: `redis://${config.get("redis.host")}:6379`,
          host: config.get("redis.host"),
          auth_pass: config.get("redis.password"),
        };
      },
      inject: [ConfigService],
      imports: [],
    }),
    ApiModule,
  ],
  controllers: [
    EventController,
    RmqController,
  ],
  providers: [
    UserHttpCacheInterceptor,
    MainService,
    PermaBanGuard,

    {
      provide: "QueryCache",
      useFactory(config: ConfigService) {
        return new QueryCache({
          url: `redis://${config.get("redis.host")}:6379`,
          password: config.get("redis.password"),
          ttl: 1000,
        });
      },
      inject: [ConfigService],
    },
    outerQueryNew(GetQueueStateQuery, "QueryCore"),
    outerQueryNew(GetUserInfoQuery, "QueryCore"),
    outerQueryNew(GetAllConnectionsQuery, "QueryCore"),
    outerQueryNew(GetConnectionsQuery, "QueryCore"),
    outerQueryNew(GetReportsAvailableQuery, "QueryCore"),
    outerQueryNew(GetRoleSubscriptionsQuery, "QueryCore"),
    outerQueryNew(GetPlayerInfoQuery, "QueryCore"),
    outerQueryNew(GetPartyInvitationsQuery, "QueryCore"),

    MessageCreatedHandler,
  ],
})
export class AppModule {}
