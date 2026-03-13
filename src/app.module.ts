import { Module } from "@nestjs/common";
import { MatchController } from "./match/match.controller";
import { SteamController } from "./steam.controller";
import SteamStrategy from "./strategy/steam.strategy";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import {
  ClientsModule,
  RedisOptions,
  RmqOptions,
  Transport,
} from "@nestjs/microservices";
import { GetUserInfoQuery } from "./gateway/queries/GetUserInfo/get-user-info.query";
import { CqrsModule } from "@nestjs/cqrs";
import { MatchMapper } from "./match/match.mapper";
import { PlayerController } from "./player/player.controller";
import { PlayerMapper } from "./player/player.mapper";
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
import { NotificationController } from "./notification/notification.controller";
import { ReadyCheckStartedHandler } from "./cache/event-handler/ready-check-started.handler";
import { NotificationService } from "./notification/notification.service";
import { SocketGateway } from "./socket/socket.gateway";
import { PartyService } from "./party.service";
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
import { LobbyController } from "./lobby/lobby.controller";
import { LobbyMapper } from "./lobby/lobby.mapper";
import { LobbyService } from "./lobby/lobby.service";
import { SocketFullDisconnectHandler } from "./socket/event-handler/scoekt-full-disconnect.handler";
import { LeaveLobbySocketDisconnectHandler } from "./lobby/event-handler/leave-lobby-socket-disconnect.handler";
import { S3Module, S3ModuleOptions } from "nestjs-s3";
import { FeedbackService } from "./feedback/feedback.service";
import { FeedbackController } from "./feedback/feedback.controller";
import { FeedbackMapper } from "./feedback/feedback.mapper";
import { NotificationMapper } from "./notification/notification.mapper";
import { FeedbackCreatedHandler } from "./notification/event-handler/feedback-created.handler";
import { NotificationCreatedHandler } from "./socket/event-handler/notification-created.handler";
import { PlayerNotLoadedHandler } from "./feedback/event-handler/player-not-loaded.handler";
import { PlayerAbandonedHandler } from "./feedback/event-handler/player-abandoned.handler";
import { AchievementCompleteHandler } from "./notification/event-handler/achievement-complete.handler";
import { AdminFeedbackController } from "./feedback/admin-feedback.controller";
import * as TelegramBot from "node-telegram-bot-api";
import { TelegramNotificationService } from "./notification/telegram-notification.service";
import { TicketMessageHandler } from "./notification/event-handler/ticket-message-handler.service";
import { StorageController } from "./storage/storage.controller";
import { BlogpostModule } from "./blogpost/blogpost.module";
import { StorageService } from "./storage/storage.service";
import { RecordModule } from "./record/record.module";
import { AiService } from "./service/ai.service";
import { PlayerSmurfDetectedHandler } from "./notification/event-handler/player-smurf-detected.handler";
import { ApiModule } from "./api/api.module";
import { getTypeormConfig } from "./config/typeorm.config";
import { PlayerReportBanCreatedHandler } from "./notification/event-handler/player-report-ban-created.handler";
import { TwitchController } from "./twitch.controller";
import TwitchStrategy from "./strategy/twitch.strategy";
import { TwitchService } from "./twitch.service";
import { StatsMapper } from "./stats/stats.mapper";
import { StatsService } from "./stats/stats.service";
import { CustomizationController } from "./customization/customization.controller";
import { UserServicesModule } from "./service/user-services.module";
import { PaymentHooksController } from "./payments/payment-hooks.controller";
import { UserPaymentsController } from "./payments/user-payments.controller";
import { PaymentService } from "./payments/payment.service";
import { PlayerFeedbackCreatedHandler } from "./notification/event-handler/player-feedback-created.handler";
import { UserRelationService } from "./service/user-relation.service";
import { RuleModule } from "./rule/rule.module";
import { ReportController } from "./report/report.controller";
import { ReportService } from "./report/report.service";
import { ReportMapper } from "./report/report.mapper";
import { PayanywayPaymentAdapter } from "./payments/payanyway-payment-adapter";
import { CreateFeedbackNotificationHandler } from "./notification/command-handler/CreateFeebackNotification/create-feedback-notification.handler";
import { RmqController } from "./rmq.controller";
import Redis from "ioredis";
import { LobbyUpdatedHandler } from "./lobby/event-handler/lobby-updated.handler";
import { LobbyReadyHandler } from "./socket/event-handler/lobby-ready.handler";
import { RabbitMQConfig, RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { ItemDropController } from "./itemdrop/item-drop.controller";
import { ItemDropMapper } from "./itemdrop/item-drop.mapper";
import { ItemDropService } from "./service/item-drop.service";
import { PlayerFinishedMatchHandler } from "./notification/event-handler/player-finished-match.handler";
import { MessageCreatedHandler } from "./cache/event-handler/message-created.handler";
import { MatchHighlightsHandler } from "./service/match-highlights.handler";
import { PleaseGoQueueHandler } from "./notification/event-handler/please-go-queue.handler";
import { RedlockModule } from "@dota2classic/redlock";
import { RedlockModuleOptions } from "@dota2classic/redlock/dist/redlock.module-definition";
import { GameResultsHandler } from "./socket/event-handler/game-results.handler";
import { SRCDSPerformanceHandler } from "./event-handler/srcds-performance.handler";
import { TournamentController } from "./tournament/tournament.controller";
import { TournamentMapper } from "./tournament/tournament.mapper";
import { TournamentReadyCheckStartedHandler } from "./event-handler/tournament-ready-check-started.handler";
import { TournamentRegistrationInvitationResolvedHandler } from "./event-handler/tournament-registration-invitation-resolved.handler";
import { TournamentRegistrationInvitationCreatedHandler } from "./event-handler/tournament-registration-invitation-created.handler";
import { PlayerBanService } from "./service/player-ban.service";
import { PermaBanGuard } from "./utils/decorator/with-user";
import { GsApiGeneratedModule } from "@dota2classic/gs-api-generated/dist/module";
import { LoggerModule } from "nestjs-pino";
import { PlayerAbandonedSocketHandler } from "./socket/event-handler/player-abandoned.handler";
import { MatchArtifactUploadedHandler } from "./storage/event-handler/match-artifact-uploaded.handler";
import { MetricsModule } from "./metrics/metrics.module";

@Module({
  imports: [
    MetricsModule,
    RuleModule,
    UserServicesModule,
    BlogpostModule,
    RecordModule,
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
    RedlockModule.registerAsync({
      imports: [],
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
    RabbitMQModule.forRootAsync({
      useFactory(config: ConfigService): RabbitMQConfig {
        return {
          exchanges: [
            {
              name: "app.events",
              type: "topic",
            },
          ],
          enableControllerDiscovery: true,
          uri: `amqp://${config.get("rabbitmq.user")}:${config.get("rabbitmq.password")}@${config.get("rabbitmq.host")}:${config.get("rabbitmq.port")}`,
        };
      },
      imports: [],
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

    ItemDropController,

    MetaController,
    StatsController,
    SteamController,
    TwitchController,
    DiscordController,
    ForumController,
    AuthController,
    NotificationController,
    FeedbackController,
    AdminFeedbackController,

    StorageController,
    CustomizationController,

    PaymentHooksController,
    UserPaymentsController,
    ReportController,
  ],
  providers: [
    UserHttpCacheInterceptor,
    MainService,
    PermaBanGuard,

    PlayerBanService,

    TournamentReadyCheckStartedHandler,
    TournamentRegistrationInvitationCreatedHandler,
    TournamentRegistrationInvitationResolvedHandler,
    StopLiveGameHandler,
    PlayerAbandonedSocketHandler,
    SRCDSPerformanceHandler,
    GameResultsHandler,
    TournamentMapper,
    {
      provide: "REDIS",
      useFactory: async (config: ConfigService) => {
        return new Redis(6379, config.get("redis.host"), {
          password: config.get("redis.password"),
        });
      },
      inject: [ConfigService],
    },

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
    LobbyService,
    ReportService,

    FeedbackService,
    AuthService,
    NotificationService,
    StorageService,
    StatsService,
    UserRelationService,

    MatchMapper,
    PlayerMapper,
    MetaMapper,
    AdminMapper,
    ForumMapper,
    LobbyMapper,
    NotificationMapper,
    FeedbackMapper,
    StatsMapper,
    ReportMapper,
    ItemDropMapper,

    LiveMatchUpdateHandler,
    ReadyCheckStartedHandler,
    PlayerFeedbackCreatedHandler,

    MatchFinishedHandler,
    FeedbackCreatedHandler,
    PlayerFinishedMatchHandler,
    AchievementCompleteHandler,
    PlayerAbandonedHandler,
    MatchHighlightsHandler,

    // API
    PartyService,
    ItemDropService,

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
    LobbyUpdatedHandler,
    StopLiveGameHandler,
    RoomNotReadyHandler,
    RoomReadyHandler,
    LobbyReadyHandler,
    PartyInvalidatedHandler,
    SocketDelivery,
    SocketMessageService,
    NotificationCreatedHandler,
    PlayerSmurfDetectedHandler,

    MatchArtifactUploadedHandler,

    // Feedback
    PlayerNotLoadedHandler,
    CreateFeedbackNotificationHandler,
    TicketMessageHandler,
    PlayerReportBanCreatedHandler,
    TelegramNotificationService,
    AiService,
    MessageCreatedHandler,
    PleaseGoQueueHandler,

    //
    PaymentService,
    PayanywayPaymentAdapter,

    // Telegram
    {
      provide: "Telegram",
      useFactory(config: ConfigService) {
        return new TelegramBot(config.get("telegram.token"));
      },
      inject: [ConfigService],
    },

  ],
})
export class AppModule {}
