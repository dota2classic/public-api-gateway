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
import { AdminGuard, WithUser } from "../../utils/decorator/with-user";
import {
  CurrentUser,
  CurrentUserDto,
} from "../../utils/decorator/current-user";
import { NotificationService } from "./notification.service";
import { ReqLoggingInterceptor } from "../../middleware/req-logging.interceptor";
import { NotificationMapper } from "./notification.mapper";
import { PleaseGoQueueEvent } from "./event/please-go-queue.event";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";

@UseInterceptors(ReqLoggingInterceptor)
@Controller("notification")
@ApiTags("notification")
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly mapper: NotificationMapper,
    private readonly amqpConnection: AmqpConnection,
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

  @AdminGuard()
  @WithUser()
  @Post("suggest_queue")
  async notifyAboutQueue(@Body() dto: TagPlayerForQueue) {
    await this.amqpConnection.publish(
      "app.events",
      PleaseGoQueueEvent.name,
      new PleaseGoQueueEvent(dto.mode),
    );

    return {
      send: 0,
      successful: 0,
      viaSocket: 0,
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
      .then((all) => Promise.all(all.map(this.mapper.mapNotification)));
  }
}
