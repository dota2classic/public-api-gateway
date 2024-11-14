import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { UserCreatedEvent } from './gateway/events/user/user-created.event';
import { Constructor, EventBus } from '@nestjs/cqrs';
import { GameResultsEvent } from './gateway/events/gs/game-results.event';
import { MessageCreatedEvent } from './gateway/events/message-created.event';
import { MatchFinishedEvent } from './gateway/events/match-finished.event';
import { ReadyCheckStartedEvent } from './gateway/events/ready-check-started.event';
import { LiveMatchUpdateEvent } from './gateway/events/gs/live-match-update.event';

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

  // @EventPattern(UserUpdatedEvent.name)
  // async UserUpdatedEvent(data: UserUpdatedEvent) {
  //   this.event(UserUpdatedEvent, data);
  // }

  @EventPattern(ReadyCheckStartedEvent.name)
  async ReadyCheckStartedEvent(data: ReadyCheckStartedEvent) {
    this.event(ReadyCheckStartedEvent, data);
  }

  @EventPattern(LiveMatchUpdateEvent.name)
  async LiveMatchUpdateEvent(data: LiveMatchUpdateEvent) {
    this.event(LiveMatchUpdateEvent, data);
  }

  @EventPattern(GameResultsEvent.name)
  async GameResultsEvent(data: GameResultsEvent) {
    this.event(GameResultsEvent, data);
  }

  @EventPattern(MessageCreatedEvent.name)
  async MessageCreatedEvent(data: MessageCreatedEvent) {
    this.event(MessageCreatedEvent, data);
  }

  @EventPattern(MatchFinishedEvent.name)
  async MatchFinishedEvent(data: MatchFinishedEvent) {
    this.event(MatchFinishedEvent, data);
  }
}
