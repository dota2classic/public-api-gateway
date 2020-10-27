import { Module } from '@nestjs/common';
import { MatchController } from './rest/match/match.controller';
import { SteamController } from './rest/steam.controller';
import SteamStrategy from './rest/strategy/steam.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { REDIS_URL } from './utils/env';
import { outerQuery } from './gateway/util/outerQuery';
import { GetAllQuery } from './gateway/queries/GetAll/get-all.query';
import { GetUserInfoQuery } from './gateway/queries/GetUserInfo/get-user-info.query';
import { UserRepository } from './cache/user/user.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { MatchMapper } from './rest/match/match.mapper';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secretdotakey:)',
      signOptions: { expiresIn: '10 days' },
    }),
    CqrsModule,
    ClientsModule.register([
      {
        name: 'QueryCore',
        transport: Transport.REDIS,
        options: {
          url: REDIS_URL(),
          retryAttempts: Infinity,
          retryDelay: 5000,
        },
      },
    ]),
  ],
  controllers: [MatchController, SteamController],
  providers: [


    outerQuery(GetAllQuery, 'QueryCore'),
    outerQuery(GetUserInfoQuery, 'QueryCore'),

    SteamStrategy,


    MatchMapper,
    UserRepository,

  ],
})
export class AppModule {}
