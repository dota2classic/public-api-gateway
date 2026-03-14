import { Module } from "@nestjs/common";
import { MatchController } from "./match.controller";
import { SRCDSPerformanceHandler } from "../event-handler/srcds-performance.handler";
import { MatchHighlightsHandler } from "../service/match-highlights.handler";
import { NotificationModule } from "../notification/notification.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DemoHighlightsEntity } from "../database/entities/demo-highlights.entity";

@Module({
  imports: [NotificationModule, TypeOrmModule.forFeature([DemoHighlightsEntity])],
  controllers: [MatchController],
  providers: [SRCDSPerformanceHandler, MatchHighlightsHandler],
})
export class MatchModule {}
