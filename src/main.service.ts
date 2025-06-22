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
import { LobbyReadyEvent } from "./gateway/events/lobby-ready.event";
import { tap } from "rxjs";

@Injectable()
export class MainService implements OnApplicationBootstrap {
  private logger = new Logger(MainService.name);

  constructor(
    private readonly qbus: QueryBus,
    private readonly ebus: EventBus,
    @Inject("QueryCore") private readonly redisEventQueue: ClientProxy,
    @Inject("MatchmakerEvents") private readonly matchmakerEvents: ClientProxy,

    private readonly t: TelegramNotificationService,
  ) {}

  async onApplicationBootstrap() {
    await this.redisEvents();
    await this.rmqEvents();
  }

  private async rmqEvents() {
    try {
      await this.matchmakerEvents.connect();
      this.logger.log("Connected to Redis");
    } catch (e) {
      this.logger.error("Error connecting to rmq", e);
    }

    const publicEvents: any[] = [LobbyReadyEvent];

    this.ebus
      .pipe(
        ofType(...publicEvents),
        tap((msg) => this.logger.log("Publishing RMQ message", msg)),
      )
      .subscribe((t) =>
        this.matchmakerEvents.emit("RMQ" + t.constructor.name, t),
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
