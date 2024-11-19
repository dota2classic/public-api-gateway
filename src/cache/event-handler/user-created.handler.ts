import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { UserCreatedEvent } from "../../gateway/events/user/user-created.event";
import { UserRepository } from "../user/user.repository";

@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
  constructor(private readonly userRep: UserRepository) {}

  async handle(event: UserCreatedEvent) {
    await this.userRep.resolve(event.playerId.value);
  }
}
