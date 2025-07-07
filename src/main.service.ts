import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from "@nestjs/common";
import { EventBus, ofType, QueryBus } from "@nestjs/cqrs";
import { ClientProxy } from "@nestjs/microservices";
import { UserLoggedInEvent } from "./gateway/events/user/user-logged-in.event";
import { TelegramNotificationService } from "./rest/notification/telegram-notification.service";
import { tap } from "rxjs";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { UserSubscriptionPaidEvent } from "./gateway/events/user/user-subscription-paid.event";

@Injectable()
export class MainService implements OnApplicationBootstrap {
  private logger = new Logger(MainService.name);

  constructor(
    private readonly qbus: QueryBus,
    private readonly ebus: EventBus,
    @Inject("QueryCore") private readonly redisEventQueue: ClientProxy,
    private readonly amqpConnection: AmqpConnection,

    private readonly t: TelegramNotificationService,
  ) {}

  async onApplicationBootstrap() {
    await this.redisEvents();
    await this.rmqEvents();
  }

  private async rmqEvents() {
    const publicEvents: any[] = [UserSubscriptionPaidEvent];

    this.ebus
      .pipe(ofType(...publicEvents))
      .subscribe((t) =>
        this.amqpConnection
          .publish("app.events", t.constructor.name, t)
          .then(() =>
            this.logger.log(`Publshed RMQ message ${t.constructor.name}`),
          ),
      );
  }

  private async redisEvents() {
    try {
      await this.redisEventQueue.connect();
      this.logger.log("Connected to Redis");
    } catch (e) {
      this.logger.error("Error connecting to redis", e);
    }

    const publicEvents: any[] = [UserLoggedInEvent];

    this.ebus
      .pipe(
        ofType(...publicEvents),
        tap((msg) => this.logger.log("Publishing Redis message", msg)),
      )
      .subscribe((t) => this.redisEventQueue.emit(t.constructor.name, t));
  }
}
