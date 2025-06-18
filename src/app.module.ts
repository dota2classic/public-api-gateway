import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { MatchController } from "./rest/match/match.controller";
import { SteamController } from "./rest/steam.controller";
import SteamStrategy from "./rest/strategy/steam.strategy";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import {
  ClientsModule,
  RedisOptions,
  RmqOptions,
  Transport,
} from "@nestjs/microservices";
import { GetUserInfoQuery } from "./gateway/queries/GetUserInfo/get-user-info.query";
import { CqrsModule } from "@nestjs/cqrs";
import { MatchMapper } from "./rest/match/match.mapper";
import { PlayerController } from "./rest/player/player.controller";
import { PlayerMapper } from "./rest/player/player.mapper";
import { JwtStrategy } from "./rest/strategy/jwt.strategy";
import { ServerController } from "./rest/admin/server.controller";
import { AdminMapper } from "./rest/admin/admin.mapper";
import { EventController } from "./event.controller";
import { AdminUserController } from "./rest/admin/admin-user.controller";
import { DiscordController } from "./rest/discord.controller";
import { DiscordStrategy } from "./rest/strategy/discord.strategy";
import { GetAllConnectionsQuery } from "./gateway/queries/GetAllConnections/get-all-connections.query";
import { GetConnectionsQuery } from "./gateway/queries/GetConnections/get-connections.query";
import { join } from "path";
import { ServeStaticModule } from "@nestjs/serve-static";
import { GetRoleSubscriptionsQuery } from "./gateway/queries/user/GetRoleSubscriptions/get-role-subscriptions.query";
import { LiveMatchUpdateHandler } from "./cache/event-handler/live-match-update.handler";
import { LiveMatchService } from "./cache/live-match.service";
import { LiveMatchController } from "./rest/match/live-match.controller";
import { GetPlayerInfoQuery } from "./gateway/queries/GetPlayerInfo/get-player-info.query";
import { StatsController } from "./rest/stats/stats.controller";
import * as redisStore from "cache-manager-redis-store";
import { MetaController } from "./rest/meta/meta.controller";
import { UserHttpCacheInterceptor } from "./utils/cache-key-track";
import { GetReportsAvailableQuery } from "./gateway/queries/GetReportsAvailable/get-reports-available.query";
import { ScheduleModule } from "@nestjs/schedule";
import { MainService } from "./main.service";
import { Entities } from "./db.config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { CacheModule, CacheModuleOptions } from "@nestjs/cache-manager";
import { QueryCache } from "./rcache";
import { MetaMapper } from "./rest/meta/meta.mapper";
import { GameResultsHandler } from "./cache/event-handler/game-results.handler";
import { ForumController } from "./rest/forum/forum.controller";
import { ThrottlerModule } from "@nestjs/throttler";
import { GetQueueStateQuery } from "./gateway/queries/QueueState/get-queue-state.query";
import {
  makeHistogramProvider,
  PrometheusModule,
} from "@willsoto/nestjs-prometheus";
import { CustomMetricsMiddleware } from "./middleware/custom-metrics.middleware";
import { PrometheusGuardedController } from "./rest/prometheus-guarded.controller";
import { BasicStrategy } from "./rest/strategy/prometheus-basic-auth.strategy";
import { ForumMapper } from "./rest/forum/forum.mapper";
import { AuthController } from "./rest/auth/auth.controller";
import { AuthService } from "./rest/auth/auth.service";
import { MatchFinishedHandler } from "./cache/event-handler/match-finished.handler";
import { NotificationController } from "./rest/notification/notification.controller";
import { ReadyCheckStartedHandler } from "./cache/event-handler/ready-check-started.handler";
import { NotificationService } from "./rest/notification/notification.service";
import { SocketGateway } from "./socket/socket.gateway";
import { PartyService } from "./rest/party.service";
import { ReadyStateUpdatedHandler } from "./socket/event-handler/ready-state-updated.handler";
import { QueueUpdatedHandler } from "./socket/event-handler/queue-updated.handler";
import { PartyUpdatedHandler } from "./socket/event-handler/party-updated.handler";
import { ReadyCheckStartedHandler as SocketReadyCheckStartedHandler } from "./socket/event-handler/ready-check-started.handler";
import { PartyInviteExpiredHandler } from "./socket/event-handler/party-invite-expired.handler";
import { PartyInviteCreatedHandler } from "./socket/event-handler/party-invite-created.handler";
import { MatchStartedHandler } from "./socket/event-handler/match-started.handler";
import { MatchCancelledHandler } from "./socket/event-handler/match-cancelled.handler";
import { SocketDelivery } from "./socket/socket-delivery";
import { SocketMessageService } from "./socket/socket-message.service";
import { GetPartyInvitationsQuery } from "./gateway/queries/GetPartyInvitations/get-party-invitations.query";
import { RoomNotReadyHandler } from "./socket/event-handler/room-not-ready.handler";
import { MatchFinishedHandler as SocketMatchFinishedHandler } from "./socket/event-handler/match-finished.handler";
import { RoomReadyHandler } from "./socket/event-handler/room-ready.handler";
import { PartyInvalidatedHandler } from "./socket/event-handler/party-invalidated.handler";
import { ConfigModule, ConfigService } from "@nestjs/config";
import configuration from "./config/configuration";
import { outerQueryNew } from "./utils/outerQueryNew";
import { ReqLoggingInterceptor } from "./middleware/req-logging.interceptor";
import { LobbyController } from "./rest/lobby/lobby.controller";
import { LobbyMapper } from "./rest/lobby/lobby.mapper";
import { LobbyService } from "./rest/lobby/lobby.service";
import { SocketFullDisconnectHandler } from "./socket/event-handler/scoekt-full-disconnect.handler";
import { LeaveLobbySocketDisconnectHandler } from "./rest/lobby/event-handler/leave-lobby-socket-disconnect.handler";
import { S3Module, S3ModuleOptions } from "nestjs-s3";
import { FeedbackService } from "./rest/feedback/feedback.service";
import { FeedbackController } from "./rest/feedback/feedback.controller";
import { FeedbackMapper } from "./rest/feedback/feedback.mapper";
import { NotificationMapper } from "./rest/notification/notification.mapper";
import { FeedbackCreatedHandler } from "./rest/notification/event-handler/feedback-created.handler";
import { NotificationCreatedHandler } from "./socket/event-handler/notification-created.handler";
import { PlayerNotLoadedHandler } from "./rest/feedback/event-handler/player-not-loaded.handler";
import { PlayerAbandonedHandler } from "./rest/feedback/event-handler/player-abandoned.handler";
import { AchievementCompleteHandler } from "./rest/notification/event-handler/achievement-complete.handler";
import { AdminFeedbackController } from "./rest/feedback/admin-feedback.controller";
import { PlayerFeedbackThreadCreatedHandler } from "./rest/notification/event-handler/player-feedback-thread-created.handler";
import * as TelegramBot from "node-telegram-bot-api";
import { TelegramNotificationService } from "./rest/notification/telegram-notification.service";
import { NewTicketMessageCreatedHandler } from "./rest/notification/event-handler/new-ticket-message-created.handler";
import { MetricsService } from "./metrics.service";
import { StorageController } from "./rest/storage/storage.controller";
import { BlogpostController } from "./rest/blogpost/blogpost.controller";
import { BlogpostMapper } from "./rest/blogpost/blogpost.mapper";
import { StorageService } from "./rest/storage/storage.service";
import { RecordController } from "./rest/record/record.controller";
import { RecordMapper } from "./rest/record/record.mapper";
import { FeedbackAssistantService } from "./rest/feedback/feedback-assistant.service";
import { PlayerSmurfDetectedHandler } from "./rest/notification/event-handler/player-smurf-detected.handler";
import { ApiModule } from "./api/api.module";
import {
  UserProfileModule as UPM,
  UserProfileModule as UMP,
} from "@dota2classic/caches";
import { getTypeormConfig } from "./config/typeorm.config";
import { PlayerReportBanCreatedHandler } from "./rest/notification/event-handler/player-report-ban-created.handler";
import { TwitchController } from "./rest/twitch.controller";
import TwitchStrategy from "./rest/strategy/twitch.strategy";
import { TwitchService } from "./rest/twitch.service";
import { StatsMapper } from "./rest/stats/stats.mapper";
import { StatsService } from "./rest/stats/stats.service";
import { CustomizationController } from "./rest/customization/customization.controller";
import { CustomizationMapper } from "./rest/customization/customization.mapper";
import { GameServerAdapter } from "./user-profile/adapter/gameserver.adapter";
import { UserAdapter } from "./user-profile/adapter/user.adapter";
import Keyv from "keyv";
import KeyvRedis from "@keyv/redis";
import { UserProfileService } from "./service/user-profile.service";
import { StorageMapper } from "./rest/storage/storage.mapper";
import { PaymentHooksController } from "./rest/payments/payment-hooks.controller";
import { UserPaymentsController } from "./rest/payments/user-payments.controller";
import { PaymentService } from "./rest/payments/payment.service";
import { PlayerFeedbackCreatedHandler } from "./rest/notification/event-handler/player-feedback-created.handler";
import { UserRelationService } from "./service/user-relation.service";
import { RuleMapper } from "./rest/rule/rule.mapper";
import { RuleController } from "./rest/rule/rule.controller";
import { RuleService } from "./rest/rule/rule.service";
import { ReportController } from "./rest/report/report.controller";
import { ReportService } from "./rest/report/report.service";
import { ReportMapper } from "./rest/report/report.mapper";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrometheusModule.register({
      path: "/metrics",
      controller: PrometheusGuardedController,
    }),
    UMP.registerAsync({
      imports: [],
      useFactory(config: ConfigService) {
        return {
          host: config.get("redis.host"),
          password: config.get("redis.password"),
          port: 6379,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      useFactory(config: ConfigService): TypeOrmModuleOptions {
        return {
          ...getTypeormConfig(config),
          type: "postgres",
          migrations: ["dist/database/migrations/*.*"],
          migrationsRun: true,
          logging: ["error"],
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
        ttl: 60_000, // 1 minute
        limit: 30, // 10 msgs
      },
    ]),
    TypeOrmModule.forFeature(Entities),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "./upload"),
      serveRoot: "/static/",
    }),
    JwtModule.registerAsync({
      useFactory(config: ConfigService): JwtModuleOptions {
        return {
          secret: config.get("api.jwtSecret"),
          signOptions: { expiresIn: "100 days" },
        };
      },
      inject: [ConfigService],
      imports: [],
    }),
    CqrsModule,
    CacheModule.registerAsync({
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
    ClientsModule.registerAsync([
      {
        name: "RMQ",
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
        imports: [],
      },
    ]),
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
        imports: [],
      },
    ]),
    ApiModule,
    UPM,
  ],
  controllers: [
    MatchController,
    LiveMatchController,
    PlayerController,
    ServerController,
    EventController,
    AdminUserController,
    LobbyController,

    RecordController,

    MetaController,
    StatsController,
    SteamController,
    TwitchController,
    DiscordController,
    ForumController,
    PrometheusGuardedController,
    AuthController,
    NotificationController,
    FeedbackController,
    AdminFeedbackController,

    StorageController,
    BlogpostController,
    CustomizationController,

    PaymentHooksController,
    UserPaymentsController,
    RuleController,
    ReportController,
  ],
  providers: [
    ReqLoggingInterceptor,
    UserHttpCacheInterceptor,
    MainService,

    GameServerAdapter,
    UserAdapter,
    StorageMapper,

    {
      provide: "full-profile",
      async useFactory(config: ConfigService) {
        return new Keyv(
          new KeyvRedis({
            url: `redis://${config.get("redis.host")}:6379`,
            password: config.get<string>("redis.password"),
          }),
          {
            namespace: "user-profile-full",
          },
        );
      },
      inject: [ConfigService],
    },
    {
      provide: "fast-user-profile",
      async useFactory(config: ConfigService) {
        return new Keyv(
          new KeyvRedis({
            url: `redis://${config.get("redis.host")}:6379`,
            password: config.get<string>("redis.password"),
          }),
          {
            namespace: "user-profile-fast",
          },
        );
      },
      inject: [ConfigService],
    },
    UserProfileService,

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
    BasicStrategy,
    TwitchStrategy,
    LiveMatchService,
    TwitchService,
    LobbyService,
    ReportService,

    FeedbackService,
    AuthService,
    NotificationService,
    StorageService,
    StatsService,
    UserRelationService,
    RuleService,

    MatchMapper,
    PlayerMapper,
    MetaMapper,
    AdminMapper,
    ForumMapper,
    LobbyMapper,
    NotificationMapper,
    FeedbackMapper,
    BlogpostMapper,
    RecordMapper,
    StatsMapper,
    CustomizationMapper,
    RuleMapper,
    ReportMapper,

    LiveMatchUpdateHandler,
    ReadyCheckStartedHandler,
    PlayerFeedbackCreatedHandler,

    GameResultsHandler,
    MatchFinishedHandler,
    FeedbackCreatedHandler,
    AchievementCompleteHandler,
    PlayerAbandonedHandler,

    // API
    PartyService,

    // Socket
    SocketGateway,
    ReadyStateUpdatedHandler,
    SocketReadyCheckStartedHandler,
    QueueUpdatedHandler,
    PartyUpdatedHandler,
    PartyInviteExpiredHandler,
    PartyInviteCreatedHandler,
    MatchStartedHandler,
    SocketMatchFinishedHandler,
    MatchCancelledHandler,
    SocketFullDisconnectHandler,
    LeaveLobbySocketDisconnectHandler,
    GameResultsHandler,
    RoomNotReadyHandler,
    RoomReadyHandler,
    PartyInvalidatedHandler,
    SocketDelivery,
    SocketMessageService,
    NotificationCreatedHandler,
    PlayerSmurfDetectedHandler,

    // Feedback
    PlayerNotLoadedHandler,
    PlayerFeedbackThreadCreatedHandler,
    NewTicketMessageCreatedHandler,
    PlayerReportBanCreatedHandler,
    TelegramNotificationService,
    FeedbackAssistantService,

    //
    PaymentService,

    // Telegram
    {
      provide: "Telegram",
      useFactory(config: ConfigService) {
        return new TelegramBot(config.get("telegram.token"));
      },
      inject: [ConfigService],
    },

    // grafana
    makeHistogramProvider({
      name: "http_requests_duration_seconds",
      help: "Duration of HTTP requests in seconds",
      labelNames: ["method", "route", "request_type", "status_code"],
      buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5], // you can adjust buckets
    }),
    MetricsService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //forRoutes('yourRootapi')
    consumer.apply(CustomMetricsMiddleware).forRoutes({
      path: "*",
      method: RequestMethod.ALL,
    });
  }
}
