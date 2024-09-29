import { Module } from '@nestjs/common';
import { MatchController } from './rest/match/match.controller';
import { SteamController } from './rest/steam.controller';
import SteamStrategy from './rest/strategy/steam.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  isDev,
  JWT_SECRET,
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_URL,
} from './utils/env';
import { outerQuery } from './gateway/util/outerQuery';
import { GetAllQuery } from './gateway/queries/GetAll/get-all.query';
import { GetUserInfoQuery } from './gateway/queries/GetUserInfo/get-user-info.query';
import { UserRepository } from './cache/user/user.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { MatchMapper } from './rest/match/match.mapper';
import { PlayerController } from './rest/player/player.controller';
import { PlayerMapper } from './rest/player/player.mapper';
import { JwtStrategy } from './rest/strategy/jwt.strategy';
import { GetPartyQuery } from './gateway/queries/GetParty/get-party.query';
import { ServerController } from './rest/admin/server.controller';
import { AdminMapper } from './rest/admin/admin.mapper';
import { UserCreatedHandler } from './cache/event-handler/user-created.handler';
import { EventController } from './event.controller';
import { UserUpdatedHandler } from './cache/event-handler/user-updated.handler';
import { AdminUserController } from './rest/admin/admin-user.controller';
import { DiscordController } from './rest/discord.controller';
import { DiscordStrategy } from './rest/strategy/discord.strategy';
import { UserConnectionRepository } from './cache/user-connection/user-connection.repository';
import { GetAllConnectionsQuery } from './gateway/queries/GetAllConnections/get-all-connections.query';
import { GetConnectionsQuery } from './gateway/queries/GetConnections/get-connections.query';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { GetRoleSubscriptionsQuery } from './gateway/queries/user/GetRoleSubscriptions/get-role-subscriptions.query';
import { LiveMatchUpdateHandler } from './cache/event-handler/live-match-update.handler';
import { GameSessionFinishedEvent } from './gateway/events/game-session-finished.event';
import { LiveMatchService } from './cache/live-match.service';
import { LiveMatchController } from './rest/match/live-match.controller';
import { GetPlayerInfoQuery } from './gateway/queries/GetPlayerInfo/get-player-info.query';
import { StatsController } from './rest/stats/stats.controller';
import * as redisStore from 'cache-manager-redis-store';
import { MetaController } from './rest/meta/meta.controller';
import { HttpCacheInterceptor } from './utils/cache-key-track';
import { GetReportsAvailableQuery } from './gateway/queries/GetReportsAvailable/get-reports-available.query';
import { MulterModule } from '@nestjs/platform-express';
import { ScheduleModule } from '@nestjs/schedule';
import { MainService } from './main.service';
import { Entities, prodDbConfig } from './db.config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { QueryCache } from './rcache';
import { MetaMapper } from './rest/meta/meta.mapper';
import { GameResultsHandler } from './cache/event-handler/game-results.handler';
import { ForumController } from './rest/forum/forum.controller';
import { ThrottlerModule } from '@nestjs/throttler';

export function qCache<T, B>() {
  return new QueryCache<T, B>({
    url: REDIS_URL(),
    password: REDIS_PASSWORD(),
    ttl: 10,
  });
}

@Module({
  imports: [
    TypeOrmModule.forRoot(
      (isDev ? prodDbConfig : prodDbConfig) as TypeOrmModuleOptions,
    ),
    ThrottlerModule.forRoot([{
      ttl: 60_000, // 1 minute
      limit: 10 // 10 msgs
    }]),
    TypeOrmModule.forFeature(Entities),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, './upload'),
      serveRoot: '/static/',
    }),
    MulterModule.register({
      dest: './dist/upload',
    }),
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '100 days' },
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
        name: 'QueryCore',
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
    ForumController
  ],
  providers: [
    HttpCacheInterceptor,
    MainService,
    outerQuery(GetAllQuery, 'QueryCore', qCache()),
    outerQuery(GetUserInfoQuery, 'QueryCore', qCache()),
    outerQuery(GetPartyQuery, 'QueryCore', qCache()),
    outerQuery(GetAllConnectionsQuery, 'QueryCore', qCache()),
    outerQuery(GetConnectionsQuery, 'QueryCore', qCache()),
    outerQuery(GetReportsAvailableQuery, 'QueryCore', qCache()),
    outerQuery(GetRoleSubscriptionsQuery, 'QueryCore', qCache()),
    outerQuery(GetPlayerInfoQuery, 'QueryCore', qCache()),

    SteamStrategy,
    JwtStrategy,
    DiscordStrategy,
    LiveMatchService,

    MatchMapper,
    PlayerMapper,
    MetaMapper,
    AdminMapper,

    UserRepository,
    UserConnectionRepository,
    UserCreatedHandler,
    UserUpdatedHandler,
    LiveMatchUpdateHandler,
    GameSessionFinishedEvent,
    GameResultsHandler
  ],
})
export class AppModule {}
