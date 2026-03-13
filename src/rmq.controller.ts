import { Controller } from "@nestjs/common";
import { CommandBus, Constructor, EventBus } from "@nestjs/cqrs";
import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { PlayerFeedbackCreatedEvent } from "./gateway/events/player-feedback-created.event";
import { MessageUpdatedEvent } from "./gateway/events/message-updated.event";
import { PlayerNotLoadedEvent } from "./gateway/events/bans/player-not-loaded.event";
import { FeedbackCreatedEvent } from "./feedback/event/feedback-created.event";
import { PlayerSmurfDetectedEvent } from "./gateway/events/bans/player-smurf-detected.event";
import { TradeOfferExpiredEvent } from "./gateway/events/trade-offer-expired.event";
import { ItemDroppedEvent } from "./gateway/events/item-dropped.event";
import { PlayerFinishedMatchEvent } from "./gateway/events/gs/player-finished-match.event";
import { MatchHighlightsEvent } from "./gateway/events/match-highlights.event";
import { AchievementCompleteEvent } from "./gateway/events/gs/achievement-complete.event";
import { PleaseGoQueueEvent } from "./notification/event/please-go-queue.event";
import { GameResultsEvent } from "./gateway/events/gs/game-results.event";
import { TournamentReadyCheckStartedEvent } from "./gateway/events/tournament/tournament-ready-check-started.event";
import { TournamentRegistrationInvitationCreatedEvent } from "./gateway/events/tournament/tournament-registration-invitation-created.event";
import { TournamentRegistrationInvitationResolvedEvent } from "./gateway/events/tournament/tournament-registration-invitation-resolved.event";
import { MatchArtifactUploadedEvent } from "./gateway/events/match-artifact-uploaded.event";
import { FeedbackCreatedCommand } from "./notification/event-handler/feedback-created.command";
import { PlayerFeedbackCreatedCommand } from "./notification/event-handler/player-feedback-created.command";
import { PlayerNotLoadedCommand } from "./feedback/event-handler/player-not-loaded.command";
import { TicketMessageCommand } from "./notification/event-handler/ticket-message.command";
import { PlayerSmurfDetectedCommand } from "./notification/event-handler/player-smurf-detected.command";
import { TradeOfferExpiredCommand } from "./notification/event-handler/trade-offer-expired.command";
import { ItemDroppedCommand } from "./itemdrop/item-dropped.command";
import { PlayerFinishedMatchCommand } from "./notification/event-handler/player-finished-match.command";
import { MatchArtifactUploadedCommand } from "./storage/event-handler/match-artifact-uploaded.command";

@Controller()
export class RmqController {
  constructor(
    private readonly cbus: CommandBus,
    private readonly ebus: EventBus,
  ) {}

  @RabbitSubscribe({
    exchange: "app.events",
    routingKey: TournamentReadyCheckStartedEvent.name,
    queue: `api-queue.${TournamentReadyCheckStartedEvent.name}`,
  })
  async TournamentReadyCheckStartedEvent(data: TournamentReadyCheckStartedEvent) {
    this.event(TournamentReadyCheckStartedEvent, data);
  }

  @RabbitSubscribe({
    exchange: "app.events",
    routingKey: PlayerFinishedMatchEvent.name,
    queue: `api-queue.${PlayerFinishedMatchEvent.name}`,
  })
  async PlayerFinishedMatchEvent(data: PlayerFinishedMatchEvent) {
    await this.cbus.execute(new PlayerFinishedMatchCommand(data));
  }

  @RabbitSubscribe({
    exchange: "app.events",
    routingKey: FeedbackCreatedEvent.name,
    queue: `api-queue.${FeedbackCreatedEvent.name}`,
  })
  async FeedbackCreatedEvent(data: FeedbackCreatedEvent) {
    await this.cbus.execute(new FeedbackCreatedCommand(data));
  }

  @RabbitSubscribe({
    exchange: "app.events",
    routingKey: PlayerFeedbackCreatedEvent.name,
    queue: `api-queue.${PlayerFeedbackCreatedEvent.name}`,
  })
  async PlayerFeedbackCreatedEvent(data: PlayerFeedbackCreatedEvent) {
    await this.cbus.execute(new PlayerFeedbackCreatedCommand(data));
  }

  @RabbitSubscribe({
    exchange: "app.events",
    routingKey: PlayerNotLoadedEvent.name,
    queue: `api-queue.${PlayerNotLoadedEvent.name}`,
  })
  async PlayerNotLoadedEvent(data: PlayerNotLoadedEvent) {
    await this.cbus.execute(new PlayerNotLoadedCommand(data));
  }

  @RabbitSubscribe({
    exchange: "app.events",
    routingKey: MessageUpdatedEvent.name,
    queue: `api-queue.${MessageUpdatedEvent.name}`,
  })
  async MessageUpdatedEvent(data: MessageUpdatedEvent) {
    await this.cbus.execute(new TicketMessageCommand(data));
  }

  @RabbitSubscribe({
    exchange: "app.events",
    routingKey: PlayerSmurfDetectedEvent.name,
    queue: `api-queue.${PlayerSmurfDetectedEvent.name}`,
  })
  async PlayerSmurfDetectedEvent(data: PlayerSmurfDetectedEvent) {
    await this.cbus.execute(new PlayerSmurfDetectedCommand(data));
  }

  @RabbitSubscribe({
    exchange: "app.events",
    routingKey: TradeOfferExpiredEvent.name,
    queue: `api-queue.${TradeOfferExpiredEvent.name}`,
  })
  async TradeOfferExpiredEvent(data: TradeOfferExpiredEvent) {
    await this.cbus.execute(new TradeOfferExpiredCommand(data));
  }

  @RabbitSubscribe({
    exchange: "app.events",
    routingKey: ItemDroppedEvent.name,
    queue: `api-queue.${ItemDroppedEvent.name}`,
  })
  async ItemDroppedEvent(data: ItemDroppedEvent) {
    await this.cbus.execute(new ItemDroppedCommand(data));
  }

  @RabbitSubscribe({
    exchange: "app.events",
    routingKey: MatchHighlightsEvent.name,
    queue: `api-queue.${MatchHighlightsEvent.name}`,
  })
  async MatchHighlightsEvent(data: MatchHighlightsEvent) {
    this.event(MatchHighlightsEvent, data);
  }

  @RabbitSubscribe({
    exchange: "app.events",
    routingKey: AchievementCompleteEvent.name,
    queue: `api-queue.${AchievementCompleteEvent.name}`,
  })
  async AchievementCompleteEvent(data: AchievementCompleteEvent) {
    this.event(AchievementCompleteEvent, data);
  }

  @RabbitSubscribe({
    exchange: "app.events",
    routingKey: PleaseGoQueueEvent.name,
    queue: `api-queue.${PleaseGoQueueEvent.name}`,
  })
  async PleaseGoQueueEvent(data: PleaseGoQueueEvent) {
    this.event(PleaseGoQueueEvent, data);
  }

  @RabbitSubscribe({
    exchange: "app.events",
    routingKey: GameResultsEvent.name,
    queue: `api-queue.${GameResultsEvent.name}`,
  })
  async GameResultsEvent(data: GameResultsEvent) {
    this.event(GameResultsEvent, data);
  }

  @RabbitSubscribe({
    exchange: "app.events",
    routingKey: TournamentRegistrationInvitationCreatedEvent.name,
    queue: `api-queue.${TournamentRegistrationInvitationCreatedEvent.name}`,
  })
  async TournamentRegistrationInvitationCreatedEvent(
    data: TournamentRegistrationInvitationCreatedEvent,
  ) {
    this.event(TournamentRegistrationInvitationCreatedEvent, data);
  }

  @RabbitSubscribe({
    exchange: "app.events",
    routingKey: TournamentRegistrationInvitationResolvedEvent.name,
    queue: `api-queue.${TournamentRegistrationInvitationResolvedEvent.name}`,
  })
  async TournamentRegistrationInvitationResolvedEvent(
    data: TournamentRegistrationInvitationResolvedEvent,
  ) {
    this.event(TournamentRegistrationInvitationResolvedEvent, data);
  }

  @RabbitSubscribe({
    exchange: "app.events",
    routingKey: MatchArtifactUploadedEvent.name,
    queue: `api-queue.${MatchArtifactUploadedEvent.name}`,
  })
  async MatchArtifactUploadedEvent(data: MatchArtifactUploadedEvent) {
    await this.cbus.execute(new MatchArtifactUploadedCommand(data));
  }

  private event<T>(constructor: Constructor<T>, data: any) {
    const buff = data;
    buff.__proto__ = constructor.prototype;
    this.ebus.publish(buff);
  }
}
