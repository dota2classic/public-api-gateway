import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { UserUpdatedEvent } from "../../gateway/events/user/user-updated.event";
import { UserProfileService } from "../service/user-profile.service";
import { UserProfileFastService } from "../service/user-profile-fast.service";

@EventsHandler(UserUpdatedEvent)
export class UserUpdatedHandler implements IEventHandler<UserUpdatedEvent> {
  constructor(
    private readonly userProfile: UserProfileService,
    private readonly userProfileFast: UserProfileFastService,
  ) {}

  async handle(event: UserUpdatedEvent) {
    await this.userProfile.updateSteamProfile(event.entry);
    await this.userProfileFast.updateSteamProfile(event.entry);
  }
}
