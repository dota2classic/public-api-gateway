import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { UserUpdatedEvent } from "../../gateway/events/user/user-updated.event";
import { UserProfileService } from "../service/user-profile.service";

@EventsHandler(UserUpdatedEvent)
export class UserUpdatedHandler implements IEventHandler<UserUpdatedEvent> {
  constructor(private readonly userProfile: UserProfileService) {}

  async handle(event: UserUpdatedEvent) {
    await this.userProfile.updateSteamProfile(event.entry);
  }
}
