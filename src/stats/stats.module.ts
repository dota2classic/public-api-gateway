import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StatsController } from "./stats.controller";
import { StatsService } from "./stats.service";
import { StatsMapper } from "./stats.mapper";
import { TwitchService } from "../twitch.service";
import { MaintenanceEntity } from "../database/entities/maintenance.entity";
import { DemoHighlightsEntity } from "../database/entities/demo-highlights.entity";
import { PlayerFlagsEntity } from "../database/entities/player-flags.entity";

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
