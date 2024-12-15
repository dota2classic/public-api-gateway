import { Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { GetAllQuery } from "./gateway/queries/GetAll/get-all.query";
import { GetAllQueryResult } from "./gateway/queries/GetAll/get-all-query.result";
import { UserRepository } from "./cache/user/user.repository";
import { UserModel } from "./cache/user/user.model";
import { ofType, QueryBus } from "@nestjs/cqrs";
import { ClientProxy } from "@nestjs/microservices";
import { UserLoggedInEvent } from "./gateway/events/user/user-logged-in.event";

@Injectable()
export class MainService implements OnApplicationBootstrap {
  constructor(
    private readonly qbus: QueryBus,
    private readonly ebus: QueryBus,
    private readonly userRepository: UserRepository,
    @Inject("QueryCore") private readonly redisEventQueue: ClientProxy,
  ) {}

  async onApplicationBootstrap() {
    try {
      await this.redisEventQueue.connect();
    } catch (e) {}

    const publicEvents: any[] = [UserLoggedInEvent];

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
