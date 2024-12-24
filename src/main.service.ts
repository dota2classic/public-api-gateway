import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from "@nestjs/common";
import { GetAllQuery } from "./gateway/queries/GetAll/get-all.query";
import { GetAllQueryResult } from "./gateway/queries/GetAll/get-all-query.result";
import { UserRepository } from "./cache/user/user.repository";
import { UserModel } from "./cache/user/user.model";
import { EventBus, ofType, QueryBus } from "@nestjs/cqrs";
import { ClientProxy } from "@nestjs/microservices";
import { UserLoggedInEvent } from "./gateway/events/user/user-logged-in.event";
import { LobbyReadyEvent } from "./gateway/events/lobby-ready.event";

@Injectable()
export class MainService implements OnApplicationBootstrap {
  private logger = new Logger(MainService.name);

  constructor(
    private readonly qbus: QueryBus,
    private readonly ebus: EventBus,
    private readonly userRepository: UserRepository,
    @Inject("QueryCore") private readonly redisEventQueue: ClientProxy,
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
  }

  // @Cron("*/30 * * * * *")
  async actualizeServers() {
    const res = await this.qbus.execute<GetAllQuery, GetAllQueryResult>(
      new GetAllQuery(),
    );

    res.entries.forEach((a) => {
      this.userRepository.save(
        a.id.value,
        new UserModel(a.id.value, a.name, a.avatar, a.roles),
      );
    });
  }
}
