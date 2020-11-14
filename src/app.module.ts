import { CacheModule, Module } from '@nestjs/common';
import { MatchController } from './rest/match/match.controller';
import { SteamController } from './rest/steam.controller';
import SteamStrategy from './rest/strategy/steam.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JWT_SECRET, REDIS_PASSWORD, REDIS_URL } from './utils/env';
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
import { AdminController } from './rest/admin/admin.controller';
import { AdminMapper } from './rest/admin/admin.mapper';

@Module({
  imports: [
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '10 days' },
    }),
    CqrsModule,
    CacheModule.register({
      ttl: 60
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
  controllers: [MatchController, SteamController, PlayerController, AdminController],
  providers: [
    outerQuery(GetAllQuery, 'QueryCore'),
    outerQuery(GetUserInfoQuery, 'QueryCore'),
    outerQuery(GetPartyQuery, 'QueryCore'),

    SteamStrategy,
    JwtStrategy,

    MatchMapper,
    PlayerMapper,
    AdminMapper,

    UserRepository,
  ],
})
export class AppModule {}
