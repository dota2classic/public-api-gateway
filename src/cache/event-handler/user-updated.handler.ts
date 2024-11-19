import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { UserUpdatedEvent } from "../../gateway/events/user/user-updated.event";
import { UserRepository } from "../user/user.repository";
import { UserModel } from "../user/user.model";

@EventsHandler(UserUpdatedEvent)
export class UserUpdatedHandler implements IEventHandler<UserUpdatedEvent> {
  constructor(private readonly userRep: UserRepository) {}

  async handle(event: UserUpdatedEvent) {
    await this.userRep.save(
      event.entry.id.value,
      new UserModel(
        event.entry.id.value,
        event.entry.name,
        event.entry.avatar,
        event.entry.roles,
      ),
    );
  }
}
