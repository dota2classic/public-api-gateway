import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MatchController } from './rest/match.controller';
import { SteamController } from './rest/steam.controller';
import SteamStrategy from './rest/strategy/steam.strategy';

@Module({
  imports: [],
  controllers: [
    MatchController,
    SteamController
  ],
  providers: [AppService, SteamStrategy],
})

export class AppModule {}
