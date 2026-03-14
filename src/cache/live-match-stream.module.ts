import { Module } from "@nestjs/common";
import { LiveMatchService } from "./live-match.service";
import { LiveMatchController } from "../match/live-match.controller";
import { LiveMatchUpdateHandler } from "./event-handler/live-match-update.handler";
import { StopLiveGameHandler } from "./event-handler/stop-live-game.handler";
import { MatchFinishedHandler } from "./event-handler/match-finished.handler";

@Module({
  controllers: [LiveMatchController],
  providers: [
    LiveMatchService,
    LiveMatchUpdateHandler,
    StopLiveGameHandler,
    MatchFinishedHandler,
  ],
})
export class LiveMatchStreamModule {}