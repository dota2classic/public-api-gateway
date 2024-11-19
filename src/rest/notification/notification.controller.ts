import { Body, Controller, Delete, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SubscriptionDto, TagPlayerForQueue } from "./notification.dto";
import { AdminGuard, WithUser } from "../../utils/decorator/with-user";
import {
  CurrentUser,
  CurrentUserDto,
} from "../../utils/decorator/current-user";
import { NotificationService } from "./notification.service";

@Controller("notification")
@ApiTags("notification")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Delete("/subscribe")
  @WithUser()
  async unsubscribe(@CurrentUser() user: CurrentUserDto) {
    await this.notificationService.unsubscribe(user.steam_id);
    return 200;
  }

  @Post("/subscribe")
  @WithUser()
  async subscribe(
    @Body() sub: SubscriptionDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    await this.notificationService.subscribe(user.steam_id, sub);
    return 200;
  }

  @AdminGuard()
  @WithUser()
  @Post("suggest_queue")
  async notifyAboutQueue(@Body() dto: TagPlayerForQueue) {
    const [payload, subs] = await this.notificationService.createHerePayload(
      dto.mode,
    );
    return this.notificationService.notify(payload, subs);
  }
}
