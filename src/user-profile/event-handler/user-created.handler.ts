import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { UserCreatedEvent } from "../../gateway/events/user/user-created.event";
import { UserProfileService } from "../service/user-profile.service";
import { UserAdapter } from "../adapter/user.adapter";

@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
  constructor(
    private readonly userService: UserProfileService,
    private readonly userAdapter: UserAdapter,
  ) {}

  async handle(event: UserCreatedEvent) {
    const { user } = await this.userAdapter.resolveUser(event.playerId.value);
    await this.userService.updateSteamProfile({
      id: event.playerId,
      avatar: user.avatar,
      roles: user.roles,
      name: user.name,
    });
  }
}
