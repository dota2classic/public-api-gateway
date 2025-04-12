import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { BanSystemEvent } from "../../gateway/events/gs/ban-system.event";
import { UserProfileService } from "../service/user-profile.service";
import { Logger } from "@nestjs/common";

@EventsHandler(BanSystemEvent)
export class BanSystemHandler implements IEventHandler<BanSystemEvent> {
  private logger = new Logger(BanSystemHandler.name);
  constructor(private readonly user: UserProfileService) {}

  async handle(event: BanSystemEvent) {
    this.logger.log("BanSystemEvent: updating summary cache");
    await this.user.updateSummary(event.id.value);
  }
}
