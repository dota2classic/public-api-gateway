import { Module } from "@nestjs/common";
import { MatchController } from "./match/match.controller";
import { SteamController } from "./steam.controller";
import SteamStrategy from "./strategy/steam.strategy";
import { GetUserInfoQuery } from "./gateway/queries/GetUserInfo/get-user-info.query";
import { PlayerController } from "./player/player.controller";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { ServerController } from "./admin/server.controller";
import { AdminMapper } from "./admin/admin.mapper";
import { EventController } from "./event.controller";
import { AdminUserController } from "./admin/admin-user.controller";
import { DiscordController } from "./discord.controller";
import { DiscordStrategy } from "./strategy/discord.strategy";
import { GetAllConnectionsQuery } from "./gateway/queries/GetAllConnections/get-all-connections.query";
import { GetConnectionsQuery } from "./gateway/queries/GetConnections/get-connections.query";
import { GetRoleSubscriptionsQuery } from "./gateway/queries/user/GetRoleSubscriptions/get-role-subscriptions.query";
import { LiveMatchUpdateHandler } from "./cache/event-handler/live-match-update.handler";
import { LiveMatchService } from "./cache/live-match.service";
import { LiveMatchController } from "./match/live-match.controller";
import { GetPlayerInfoQuery } from "./gateway/queries/GetPlayerInfo/get-player-info.query";
import { StatsController } from "./stats/stats.controller";
import * as redisStore from "cache-manager-redis-store";
import { MetaController } from "./meta/meta.controller";
import { UserHttpCacheInterceptor } from "./utils/cache-key-track";
import { GetReportsAvailableQuery } from "./gateway/queries/GetReportsAvailable/get-reports-available.query";
import { ScheduleModule } from "@nestjs/schedule";
import { MainService } from "./main.service";
import { Entities } from "./db.config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { CacheModule, CacheModuleOptions } from "@nestjs/cache-manager";
import { QueryCache } from "./rcache";
import { MetaMapper } from "./meta/meta.mapper";
import { StopLiveGameHandler } from "./cache/event-handler/stop-live-game.handler";
import { ForumController } from "./forum/forum.controller";
import { ThrottlerModule } from "@nestjs/throttler";
import { GetQueueStateQuery } from "./gateway/queries/QueueState/get-queue-state.query";
import { ForumMapper } from "./forum/forum.mapper";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { MatchFinishedHandler } from "./cache/event-handler/match-finished.handler";
import { ReadyCheckStartedHandler } from "./cache/event-handler/ready-check-started.handler";
import { GetPartyInvitationsQuery } from "./gateway/queries/GetPartyInvitations/get-party-invitations.query";
import { ConfigModule, ConfigService } from "@nestjs/config";
import configuration from "./config/configuration";
import { outerQueryNew } from "./utils/outerQueryNew";
import { LobbyController } from "./lobby/lobby.controller";
import { LeaveLobbySocketDisconnectHandler } from "./lobby/event-handler/leave-lobby-socket-disconnect.handler";
import { S3Module, S3ModuleOptions } from "nestjs-s3";
import { FeedbackService } from "./feedback/feedback.service";
import { FeedbackController } from "./feedback/feedback.controller";
import { FeedbackMapper } from "./feedback/feedback.mapper";
import { PlayerNotLoadedHandler } from "./feedback/event-handler/player-not-loaded.handler";
import { PlayerAbandonedHandler } from "./feedback/event-handler/player-abandoned.handler";
import { PlayerFinishedMatchHandler } from "./notification/event-handler/player-finished-match.handler";
import { AdminFeedbackController } from "./feedback/admin-feedback.controller";
import { StorageController } from "./storage/storage.controller";
import { BlogpostModule } from "./blogpost/blogpost.module";
import { StorageService } from "./storage/storage.service";
import { RecordModule } from "./record/record.module";
import { AiService } from "./service/ai.service";
import { ApiModule } from "./api/api.module";
import { getTypeormConfig } from "./config/typeorm.config";
import { TwitchController } from "./twitch.controller";
import TwitchStrategy from "./strategy/twitch.strategy";
import { TwitchService } from "./twitch.service";
import { StatsMapper } from "./stats/stats.mapper";
import { StatsService } from "./stats/stats.service";
import { CustomizationController } from "./customization/customization.controller";
import { UserServicesModule } from "./service/user-services.module";
import { RuleModule } from "./rule/rule.module";
import { ReportController } from "./report/report.controller";
import { ReportService } from "./report/report.service";
import { ReportMapper } from "./report/report.mapper";
import { RmqController } from "./rmq.controller";
import { LobbyMapper } from "./lobby/lobby.mapper";
import { LobbyUpdatedHandler } from "./lobby/event-handler/lobby-updated.handler";
import { MessageCreatedHandler } from "./cache/event-handler/message-created.handler";
import { MatchHighlightsHandler } from "./service/match-highlights.handler";
import { SRCDSPerformanceHandler } from "./event-handler/srcds-performance.handler";
import { TournamentController } from "./tournament/tournament.controller";
import { TournamentMapper } from "./tournament/tournament.mapper";
import { TournamentReadyCheckStartedHandler } from "./event-handler/tournament-ready-check-started.handler";
import { TournamentRegistrationInvitationResolvedHandler } from "./event-handler/tournament-registration-invitation-resolved.handler";
import { TournamentRegistrationInvitationCreatedHandler } from "./event-handler/tournament-registration-invitation-created.handler";
import { PermaBanGuard } from "./utils/decorator/with-user";
import { GsApiGeneratedModule } from "@dota2classic/gs-api-generated/dist/module";
import { LoggerModule } from "nestjs-pino";
import { MatchArtifactUploadedHandler } from "./storage/event-handler/match-artifact-uploaded.handler";
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
    MatchController,
    LiveMatchController,
    PlayerController,
    ServerController,
    EventController,
    RmqController,
    AdminUserController,
    LobbyController,
    TournamentController,

    MetaController,
    StatsController,
    SteamController,
    TwitchController,
    DiscordController,
    ForumController,
    AuthController,
    FeedbackController,
    AdminFeedbackController,

    StorageController,
    CustomizationController,

    ReportController,
  ],
  providers: [
    UserHttpCacheInterceptor,
    MainService,
    PermaBanGuard,

    TournamentReadyCheckStartedHandler,
    TournamentRegistrationInvitationCreatedHandler,
    TournamentRegistrationInvitationResolvedHandler,
    StopLiveGameHandler,
    SRCDSPerformanceHandler,
    TournamentMapper,

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

    SteamStrategy,
    JwtStrategy,
    DiscordStrategy,
    TwitchStrategy,
    LiveMatchService,
    TwitchService,
    ReportService,

    FeedbackService,
    AuthService,
    StorageService,
    StatsService,

    MetaMapper,
    AdminMapper,
    ForumMapper,
    FeedbackMapper,
    LobbyMapper,
    StatsMapper,
    ReportMapper,

    LiveMatchUpdateHandler,
    ReadyCheckStartedHandler,

    MatchFinishedHandler,
    MatchHighlightsHandler,

    // Lobby socket handlers (will move to LobbyModule later)
    LeaveLobbySocketDisconnectHandler,
    LobbyUpdatedHandler,

    // Feedback handlers
    PlayerNotLoadedHandler,
    PlayerAbandonedHandler,
    PlayerFinishedMatchHandler,

    AiService,
    MessageCreatedHandler,

    MatchArtifactUploadedHandler,
  ],
})
export class AppModule {}
