import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
  NotificationDto,
  SubscriptionDto,
  TagPlayerForQueue,
} from "./notification.dto";
import { ModeratorGuard, WithUser } from "../../utils/decorator/with-user";
import {
  CurrentUser,
  CurrentUserDto,
} from "../../utils/decorator/current-user";
import { NotificationService } from "./notification.service";
import { ReqLoggingInterceptor } from "../../middleware/req-logging.interceptor";
import { NotificationMapper } from "./notification.mapper";

@UseInterceptors(ReqLoggingInterceptor)
@Controller("notification")
@ApiTags("notification")
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly mapper: NotificationMapper,
  ) {}

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

  @ModeratorGuard()
  @WithUser()
  @Post("suggest_queue")
  async notifyAboutQueue(@Body() dto: TagPlayerForQueue) {
    const [payload, subs] = await this.notificationService.createHerePayload(
      dto.mode,
    );
    const { send, successful } = await this.notificationService.notify(
      payload,
      subs,
    );
    const viaSocket = await this.notificationService.notifyOnliners(dto.mode);

    return {
      send,
      successful,
      viaSocket,
    };
  }

  @Patch("/:id")
  @WithUser()
  public async acknowledge(
    @Param("id") id: string,
    @CurrentUser() user: CurrentUserDto,
  ): Promise<NotificationDto> {
    return this.notificationService
      .acknowledge(id, user.steam_id)
      .then(this.mapper.mapNotification);
  }

  @Get("/all")
  @WithUser()
  public async getNotifications(
    @CurrentUser() user: CurrentUserDto,
  ): Promise<NotificationDto[]> {
    return this.notificationService
      .getNotifications(user.steam_id)
      .then((all) => all.map(this.mapper.mapNotification));
  }
}
