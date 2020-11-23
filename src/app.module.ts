import { CacheModule, Logger, Module } from '@nestjs/common';
import { MatchController } from './rest/match/match.controller';
import { SteamController } from './rest/steam.controller';
import SteamStrategy from './rest/strategy/steam.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { isDev, JWT_SECRET, REDIS_PASSWORD, REDIS_URL } from './utils/env';
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
import { join } from "path";
import { ServeStaticModule } from '@nestjs/serve-static';
import { GetRoleSubscriptionsQuery } from './gateway/queries/user/GetRoleSubscriptions/get-role-subscriptions.query';
import { SentryModule } from '@ntegral/nestjs-sentry';

@Module({
  imports: [
    SentryModule.forRoot({
      dsn:
        "https://a35837c6229e4ba89afaec487df6e21c@o435989.ingest.sentry.io/5529680",
      debug: false,
      environment: isDev ? "dev" : "production",
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
    PlayerController,
    ServerController,
    EventController,
    AdminUserController,

    SteamController,
    DiscordController,
  ],
  providers: [
    outerQuery(GetAllQuery, 'QueryCore'),
    outerQuery(GetUserInfoQuery, 'QueryCore'),
    outerQuery(GetPartyQuery, 'QueryCore'),
    outerQuery(GetAllConnectionsQuery, 'QueryCore'),
    outerQuery(GetConnectionsQuery, 'QueryCore'),
    outerQuery(GetRoleSubscriptionsQuery, 'QueryCore'),

    {
      provide: 'DiscordClient',
      useFactory: async () => {
        const client = new Client();

        const logger = new Logger(Client.name);

        await client.login(
          `NzU4OTAwMDY4MzYzMDEwMDcy.X21qww.4JFzI_R1JOiSb6I3Vmo2pT3NuGQ`,
        );

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

    MatchMapper,
    PlayerMapper,
    AdminMapper,

    UserRepository,
    UserConnectionRepository,
    UserCreatedHandler,
    UserUpdatedHandler,
  ],
})
export class AppModule {}
