import { CacheModule, Logger, Module } from '@nestjs/common';
import { MatchController } from './rest/match/match.controller';
import { SteamController } from './rest/steam.controller';
import SteamStrategy from './rest/strategy/steam.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DISCORD_API_TOKEN, isDev, JWT_SECRET, REDIS_PASSWORD, REDIS_URL } from './utils/env';
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
import { Client } from 'discord.js';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { GetRoleSubscriptionsQuery } from './gateway/queries/user/GetRoleSubscriptions/get-role-subscriptions.query';
import { SentryModule } from '@ntegral/nestjs-sentry';
import { LiveMatchUpdateHandler } from './cache/event-handler/live-match-update.handler';
import { GameSessionFinishedEvent } from './gateway/events/game-session-finished.event';
import { MatchFinishedHandler } from './cache/event-handler/match-finished.handler';
import { LiveMatchService } from './cache/live-match.service';
import { LiveMatchController } from './rest/match/live-match.controller';
import { GetPlayerInfoQuery } from './gateway/queries/GetPlayerInfo/get-player-info.query';
import { GetAllQueryResult } from './gateway/queries/GetAll/get-all-query.result';
import { GetUserInfoQueryResult } from './gateway/queries/GetUserInfo/get-user-info-query.result';
import { GetPartyQueryResult } from './gateway/queries/GetParty/get-party-query.result';
import { GetAllConnectionsQueryResult } from './gateway/queries/GetAllConnections/get-all-connections-query.result';
import { GetConnectionsQueryResult } from './gateway/queries/GetConnections/get-connections-query.result';
import { GetRoleSubscriptionsQueryResult } from './gateway/queries/user/GetRoleSubscriptions/get-role-subscriptions-query.result';
import { GetPlayerInfoQueryResult } from './gateway/queries/GetPlayerInfo/get-player-info-query.result';
import { StatsController } from './rest/stats/stats.controller';
import { QueryCache } from 'd2c-rcaches';
import * as redisStore from 'cache-manager-redis-store';


const host = REDIS_URL().replace('redis://', '').split(':')[0];


@Module({
  imports: [
    SentryModule.forRoot({
      dsn:
        'https://a35837c6229e4ba89afaec487df6e21c@o435989.ingest.sentry.io/5529680',
      debug: false,
      environment: isDev ? 'dev' : 'production',
      logLevel: 2, //based on sentry.io loglevel //
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, './upload'),
      serveRoot: '/static/',
    }),
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '10 days' },
    }),
    CqrsModule,
    CacheModule.register({
      ttl: 60,
      store: redisStore,
      host: host,
      port: 6379,
      auth_pass: REDIS_PASSWORD(),

    }),
    ClientsModule.register([
      {
        name: 'QueryCore',
        transport: Transport.REDIS,
        options: {
          password: REDIS_PASSWORD(),
          url: REDIS_URL(),
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

    StatsController,
    SteamController,
    DiscordController,
  ],
  providers: [
    outerQuery(
      GetAllQuery,
      'QueryCore',
      new QueryCache<GetAllQuery, GetAllQueryResult>({
        url: REDIS_URL(),
        password: REDIS_PASSWORD(),
        ttl: 10
      }),
    ),
    outerQuery(
      GetUserInfoQuery,
      'QueryCore',
      new QueryCache<GetUserInfoQuery, GetUserInfoQueryResult>({
        url: REDIS_URL(),
        password: REDIS_PASSWORD(),
        ttl: 200
      }),
    ),
    outerQuery(
      GetPartyQuery,
      'QueryCore',
      new QueryCache<GetPartyQuery, GetPartyQueryResult>({
        url: REDIS_URL(),
        password: REDIS_PASSWORD(),
        ttl: 10
      }),
    ),
    outerQuery(
      GetAllConnectionsQuery,
      'QueryCore',
      new QueryCache<GetAllConnectionsQuery, GetAllConnectionsQueryResult>({
        url: REDIS_URL(),
        password: REDIS_PASSWORD(),
        ttl: 10
      }),
    ),
    outerQuery(
      GetConnectionsQuery,
      'QueryCore',
      new QueryCache<GetConnectionsQuery, GetConnectionsQueryResult>({
        url: REDIS_URL(),
        password: REDIS_PASSWORD(),
        ttl: 10
      }),
    ),
    outerQuery(
      GetRoleSubscriptionsQuery,
      'QueryCore',
      new QueryCache<
        GetRoleSubscriptionsQuery,
        GetRoleSubscriptionsQueryResult
      >({
        url: REDIS_URL(),
        password: REDIS_PASSWORD(),
        ttl: 10
      }),
    ),
    outerQuery(
      GetPlayerInfoQuery,
      'QueryCore',
      new QueryCache<GetPlayerInfoQuery, GetPlayerInfoQueryResult>({
        url: REDIS_URL(),
        password: REDIS_PASSWORD(),
        ttl: 10
      }),
    ),

    {
      provide: 'DiscordClient',
      useFactory: async () => {
        const client = new Client();

        const logger = new Logger(Client.name);

        await client.login(DISCORD_API_TOKEN());

        let resolve: () => void;
        const readyPromise = new Promise(r => {
          resolve = r;
        });

        client.on('ready', async () => {
          logger.log('Bot ready and operating.');
          resolve();
        });

        await readyPromise;

        return client;
      },
    },

    SteamStrategy,
    JwtStrategy,
    DiscordStrategy,
    LiveMatchService,

    MatchMapper,
    PlayerMapper,
    AdminMapper,

    UserRepository,
    UserConnectionRepository,
    UserCreatedHandler,
    UserUpdatedHandler,
    LiveMatchUpdateHandler,
    GameSessionFinishedEvent,
    MatchFinishedHandler,
  ],
})
export class AppModule {}
