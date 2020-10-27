import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MatchController } from './rest/match.controller';

@Module({
  imports: [],
  controllers: [
    MatchController
  ],
  providers: [AppService],
})
export class AppModule {}
