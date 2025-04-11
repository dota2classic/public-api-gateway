import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from "@nestjs/common";
import { EventBus, ofType, QueryBus } from "@nestjs/cqrs";
import { ClientProxy } from "@nestjs/microservices";
import { UserLoggedInEvent } from "./gateway/events/user/user-logged-in.event";
import { LobbyReadyEvent } from "./gateway/events/lobby-ready.event";
import { TelegramNotificationService } from "./rest/notification/telegram-notification.service";

@Injectable()
export class MainService implements OnApplicationBootstrap {
  private logger = new Logger(MainService.name);

  constructor(
    private readonly qbus: QueryBus,
    private readonly ebus: EventBus,
    @Inject("QueryCore") private readonly redisEventQueue: ClientProxy,
    private readonly t: TelegramNotificationService,
  ) {}

  async onApplicationBootstrap() {
    try {
      await this.redisEventQueue.connect();
      this.logger.log("Connected to Redis");
    } catch (e) {
      this.logger.error("Error connecting to redis", e);
    }

    const publicEvents: any[] = [UserLoggedInEvent, LobbyReadyEvent];

    this.ebus
      .pipe(ofType(...publicEvents))
      .subscribe((t) => this.redisEventQueue.emit(t.constructor.name, t));

    // await this.t.notifyFeedback(
    //   "amogus"
    // )
  }
}
