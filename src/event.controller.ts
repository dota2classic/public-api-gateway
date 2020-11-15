import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { UserCreatedEvent } from './gateway/events/user/user-created.event';
import { Constructor, EventBus } from '@nestjs/cqrs';
import { UserUpdatedEvent } from './gateway/events/user/user-updated.event';

@Controller()
export class EventController {

  constructor(private readonly ebus: EventBus) {
  }

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
}