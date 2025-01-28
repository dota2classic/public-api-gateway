import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { UserCreatedEvent } from "./gateway/events/user/user-created.event";
import { Constructor, EventBus } from "@nestjs/cqrs";
import { GameResultsEvent } from "./gateway/events/gs/game-results.event";
import { MatchFinishedEvent } from "./gateway/events/match-finished.event";
import { ReadyCheckStartedEvent } from "./gateway/events/ready-check-started.event";
import { LiveMatchUpdateEvent } from "./gateway/events/gs/live-match-update.event";
import { PartyUpdatedEvent } from "./gateway/events/party/party-updated.event";
import { PartyInviteExpiredEvent } from "./gateway/events/party/party-invite-expired.event";
import { PartyInviteCreatedEvent } from "./gateway/events/party/party-invite-created.event";
import { RoomNotReadyEvent } from "./gateway/events/room-not-ready.event";
import { GameServerStartedEvent } from "./gateway/events/game-server-started.event";
import { MatchStartedEvent } from "./gateway/events/match-started.event";
import { ReadyStateUpdatedEvent } from "./gateway/events/ready-state-updated.event";
import { QueueUpdatedEvent } from "./gateway/events/queue-updated.event";
import { QueueCreatedEvent } from "./gateway/events/queue-created.event";
import { UserUpdatedEvent } from "./gateway/events/user/user-updated.event";
import { MatchCancelledEvent } from "./gateway/events/match-cancelled.event";
import { RoomReadyEvent } from "./gateway/events/room-ready.event";
import { MessageUpdatedEvent } from "./gateway/events/message-updated.event";
import { PlayerNotLoadedEvent } from "./gateway/events/bans/player-not-loaded.event";

@Controller()
export class EventController {
  constructor(private readonly ebus: EventBus) {}

  private event<T>(constructor: Constructor<T>, data: any) {
    const buff = data;
    buff.__proto__ = constructor.prototype;
    this.ebus.publish(buff);
  }

  @EventPattern(UserCreatedEvent.name)
  async UserCreatedEvent(data: UserCreatedEvent) {
    this.event(UserCreatedEvent, data);
  }

  @EventPattern(UserUpdatedEvent.name)
  async UserUpdatedEvent(data: UserUpdatedEvent) {
    this.event(UserUpdatedEvent, data);
  }

  @EventPattern(LiveMatchUpdateEvent.name)
  async LiveMatchUpdateEvent(data: LiveMatchUpdateEvent) {
    this.event(LiveMatchUpdateEvent, data);
  }

  @EventPattern(GameResultsEvent.name)
  async GameResultsEvent(data: GameResultsEvent) {
    this.event(GameResultsEvent, data);
  }

  @EventPattern("QueueUpdatedEvent")
  async QueueUpdatedEvent(data: QueueUpdatedEvent) {
    this.event(QueueUpdatedEvent, data);
  }

  @EventPattern("QueueCreatedEvent")
  async QueueCreatedEvent(data: QueueCreatedEvent) {
    this.event(QueueCreatedEvent, data);
    this.event(QueueUpdatedEvent, data);
  }

  @EventPattern("ReadyCheckStartedEvent")
  async ReadyCheckStartedEvent(data: ReadyCheckStartedEvent) {
    this.event(ReadyCheckStartedEvent, data);
  }

  @EventPattern(ReadyStateUpdatedEvent.name)
  async ReadyStateUpdatedEvent(data: ReadyStateUpdatedEvent) {
    this.event(ReadyStateUpdatedEvent, data);
  }

  @EventPattern(MatchStartedEvent.name)
  async MatchStartedEvent(data: MatchStartedEvent) {
    this.event(MatchStartedEvent, data);
  }

  @EventPattern(MatchFinishedEvent.name)
  async MatchFinishedEvent(data: MatchFinishedEvent) {
    this.event(MatchFinishedEvent, data);
  }

  @EventPattern(MatchCancelledEvent.name)
  async MatchCancelledEvent(data: MatchCancelledEvent) {
    this.event(MatchCancelledEvent, data);
  }

  @EventPattern(GameServerStartedEvent.name)
  async GameServerStartedEvent(data: GameServerStartedEvent) {
    this.event(GameServerStartedEvent, data);
  }

  @EventPattern(RoomNotReadyEvent.name)
  async RoomNotReadyEvent(data: RoomNotReadyEvent) {
    this.event(RoomNotReadyEvent, data);
  }

  @EventPattern(RoomReadyEvent.name)
  async RoomReadyEvent(data: RoomReadyEvent) {
    this.event(RoomReadyEvent, data);
  }

  @EventPattern(PartyInviteCreatedEvent.name)
  async PartyInviteCreatedEvent(data: PartyInviteCreatedEvent) {
    this.event(PartyInviteCreatedEvent, data);
  }

  @EventPattern(PartyInviteExpiredEvent.name)
  async PartyInviteExpiredEvent(data: PartyInviteExpiredEvent) {
    this.event(PartyInviteExpiredEvent, data);
  }

  @EventPattern(PartyUpdatedEvent.name)
  async PartyUpdatedEvent(data: PartyUpdatedEvent) {
    this.event(PartyUpdatedEvent, data);
  }

  @EventPattern(MessageUpdatedEvent.name)
  async MessageUpdatedEvent(data: MessageUpdatedEvent) {
    this.event(MessageUpdatedEvent, data);
  }

  @EventPattern(PlayerNotLoadedEvent.name)
  async PlayerNotLoadedEvent(data: PlayerNotLoadedEvent) {
    this.event(PlayerNotLoadedEvent, data);
  }
}
