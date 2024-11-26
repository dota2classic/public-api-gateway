import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MatchController } from "./rest/match/match.controller";
import { SteamController } from "./rest/steam.controller";
import SteamStrategy from "./rest/strategy/steam.strategy";
import { JwtModule } from "@nestjs/jwt";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { JWT_SECRET, REDIS_HOST, REDIS_PASSWORD, REDIS_URL } from "./utils/env";
import { outerQuery } from "./gateway/util/outerQuery";
import { GetAllQuery } from "./gateway/queries/GetAll/get-all.query";
import { GetUserInfoQuery } from "./gateway/queries/GetUserInfo/get-user-info.query";
import { UserRepository } from "./cache/user/user.repository";
import { CqrsModule } from "@nestjs/cqrs";
import { MatchMapper } from "./rest/match/match.mapper";
import { PlayerController } from "./rest/player/player.controller";
import { PlayerMapper } from "./rest/player/player.mapper";
import { JwtStrategy } from "./rest/strategy/jwt.strategy";
import { GetPartyQuery } from "./gateway/queries/GetParty/get-party.query";
import { ServerController } from "./rest/admin/server.controller";
import { AdminMapper } from "./rest/admin/admin.mapper";
import { UserCreatedHandler } from "./cache/event-handler/user-created.handler";
import { EventController } from "./event.controller";
import { UserUpdatedHandler } from "./cache/event-handler/user-updated.handler";
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
import { HttpCacheInterceptor } from "./utils/cache-key-track";
import { GetReportsAvailableQuery } from "./gateway/queries/GetReportsAvailable/get-reports-available.query";
import { MulterModule } from "@nestjs/platform-express";
import { ScheduleModule } from "@nestjs/schedule";
import { MainService } from "./main.service";
import { Entities, prodDbConfig } from "./db.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CacheModule } from "@nestjs/cache-manager";
import { QueryCache } from "./rcache";
import { MetaMapper } from "./rest/meta/meta.mapper";
import { GameResultsHandler } from "./cache/event-handler/game-results.handler";
import { ForumController } from "./rest/forum/forum.controller";
import { ThrottlerModule } from "@nestjs/throttler";
import { GetQueueStateQuery } from "./gateway/queries/QueueState/get-queue-state.query";
import {
  makeCounterProvider,
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
import { GetSessionByUserQuery } from "./gateway/queries/GetSessionByUser/get-session-by-user.query";
import { SocketGateway } from "./socket/socket.gateway";
import { PlayerAPIProvider } from "./generated-api/api-providers";
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
import { GetUserRoomQuery } from "./gateway/queries/GetUserRoom/get-user-room.query";
import { GetPartyInvitationsQuery } from "./gateway/queries/GetPartyInvitations/get-party-invitations.query";
import { PartyQueueStateUpdatedHandler } from "./socket/event-handler/party-queue-state-updated.handler";
import { RoomNotReadyHandler } from "./socket/event-handler/room-not-ready.handler";
import { MatchFinishedHandler as SocketMatchFinishedHandler } from "./socket/event-handler/match-finished.handler";
import { RoomReadyHandler } from "./socket/event-handler/room-ready.handler";
import { PartyInvalidatedHandler } from "./socket/event-handler/party-invalidated.handler";

export function qCache<T, B>() {
  return new QueryCache<T, B>({
    url: REDIS_URL(),
    password: REDIS_PASSWORD(),
    ttl: 10,
  });
}

@Module({
  imports: [
    PrometheusModule.register({
      path: "/metrics",
      controller: PrometheusGuardedController,
    }),
    TypeOrmModule.forRoot(prodDbConfig),
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
    MulterModule.register({
      dest: "./dist/upload",
    }),
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: "100 days" },
    }),
    CqrsModule,
    CacheModule.register({
      ttl: 60,
      store: redisStore,
      port: 6379,
      url: REDIS_URL(),
      host: REDIS_HOST(),
      auth_pass: REDIS_PASSWORD(),
    }),
    ClientsModule.register([
      {
        name: "QueryCore",
        transport: Transport.REDIS,
        options: {
          password: REDIS_PASSWORD(),
          host: REDIS_HOST(),
          retryAttempts: Infinity,
          retryDelay: 5000,
        },
      },
    ]),
  ],
  controllers: [
    MatchController,
    LiveMatchController,
    PlayerController,
    ServerController,
    EventController,
    AdminUserController,

    MetaController,
    StatsController,
    SteamController,
    DiscordController,
    ForumController,
    PrometheusGuardedController,
    AuthController,
    NotificationController,
  ],
  providers: [
    HttpCacheInterceptor,
    MainService,
    outerQuery(GetQueueStateQuery, "QueryCore", qCache()),
    outerQuery(GetAllQuery, "QueryCore", qCache()),
    outerQuery(GetUserInfoQuery, "QueryCore", qCache()),
    outerQuery(GetPartyQuery, "QueryCore", qCache()),
    outerQuery(GetAllConnectionsQuery, "QueryCore", qCache()),
    outerQuery(GetConnectionsQuery, "QueryCore", qCache()),
    outerQuery(GetReportsAvailableQuery, "QueryCore", qCache()),
    outerQuery(GetRoleSubscriptionsQuery, "QueryCore", qCache()),
    outerQuery(GetPlayerInfoQuery, "QueryCore", qCache()),
    outerQuery(GetSessionByUserQuery, "QueryCore", qCache()),
    outerQuery(GetUserRoomQuery, "QueryCore", qCache()),
    outerQuery(GetPartyInvitationsQuery, "QueryCore", qCache()),

    SteamStrategy,
    JwtStrategy,
    DiscordStrategy,
    BasicStrategy,
    LiveMatchService,

    AuthService,
    NotificationService,

    MatchMapper,
    PlayerMapper,
    MetaMapper,
    AdminMapper,
    ForumMapper,

    UserRepository,
    UserCreatedHandler,
    UserUpdatedHandler,
    LiveMatchUpdateHandler,
    ReadyCheckStartedHandler,

    GameResultsHandler,
    MatchFinishedHandler,

    // API
    PartyService,
    PlayerAPIProvider,

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
    GameResultsHandler,
    PartyQueueStateUpdatedHandler,
    RoomNotReadyHandler,
    RoomReadyHandler,
    PartyInvalidatedHandler,
    SocketDelivery,
    SocketMessageService,

    // grafana
    makeCounterProvider({
      name: "my_app_requests",
      help: "The number of requests processed by the application",
      labelNames: ["status"],
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //forRoutes('yourRootapi')
    consumer
      .apply(CustomMetricsMiddleware)
      .forRoutes("match", "live", "player", "admin", "meta", "stats", "forum");
  }
}
