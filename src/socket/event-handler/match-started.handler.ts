import { EventBus, EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { MatchStartedEvent } from "../../gateway/events/match-started.event";
import { SocketDelivery } from "../socket-delivery";
import { MessageTypeS2C } from "../messages/s2c/message-type.s2c";
import { PartyInvalidatedEvent } from "../event/party-invalidated.event";
import { SocketMessageService } from "../socket-message.service";
import { Logger } from "@nestjs/common";

@EventsHandler(MatchStartedEvent)
export class MatchStartedHandler implements IEventHandler<MatchStartedEvent> {
  private logger = new Logger(MatchStartedHandler.name);
  constructor(
    private readonly delivery: SocketDelivery,
    private readonly ebus: EventBus,
    private readonly socketMessage: SocketMessageService,
  ) {}

  async handle(event: MatchStartedEvent) {
    const players = event.info.players.map((it) => it.steamId);

    await new Promise((r) => setTimeout(r, 5000));

    this.ebus.publishAll(
      players.map((steamId) => new PartyInvalidatedEvent(steamId)),
    );

    await Promise.all(
      players.map(async (steamId) => {
        const msg = await this.socketMessage.playerGameState(steamId);
        await this.delivery
          .deliver(steamId, MessageTypeS2C.PLAYER_GAME_STATE, msg)
          .catch((e) => this.logger.warn("Issue sending socket message", e));
      }),
    );
  }
}
