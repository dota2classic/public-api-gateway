import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StatsController } from "./stats.controller";
import { StatsService } from "./stats.service";
import { StatsMapper } from "./stats.mapper";
import { TwitchService } from "../twitch.service";
import { MaintenanceEntity } from "../entity/maintenance.entity";
import { DemoHighlightsEntity } from "../entity/demo-highlights.entity";
import { PlayerFlagsEntity } from "../entity/player-flags.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MaintenanceEntity,
      DemoHighlightsEntity,
      PlayerFlagsEntity,
    ]),
  ],
  controllers: [StatsController],
  providers: [StatsService, StatsMapper, TwitchService],
  exports: [TwitchService],
})
export class StatsModule {}
