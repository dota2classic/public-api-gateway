import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { GameResultsEvent } from "../../gateway/events/gs/game-results.event";
import { LiveMatchService } from "../live-match.service";

@EventsHandler(GameResultsEvent)
export class GameResultsHandler implements IEventHandler<GameResultsEvent> {
  constructor(private readonly ls: LiveMatchService) {}

  async handle(event: GameResultsEvent) {
    this.ls.onStop(event.matchId);
  }
}
