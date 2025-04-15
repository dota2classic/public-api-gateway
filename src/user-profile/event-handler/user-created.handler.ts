import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { UserCreatedEvent } from "../../gateway/events/user/user-created.event";
import { UserProfileService } from "../service/user-profile.service";
import { UserAdapter } from "../adapter/user.adapter";
import { UserProfileFastService } from "../service/user-profile-fast.service";

@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
  constructor(
    private readonly userService: UserProfileService,
    private readonly fastUser: UserProfileFastService,
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

    await this.fastUser.updateSteamProfile({
      id: event.playerId,
      avatar: user.avatar,
      roles: user.roles,
      name: user.name,
    });
  }
}
