import { Injectable } from "@nestjs/common";
import { GetAllQuery } from "./gateway/queries/GetAll/get-all.query";
import { GetAllQueryResult } from "./gateway/queries/GetAll/get-all-query.result";
import { UserRepository } from "./cache/user/user.repository";
import { UserModel } from "./cache/user/user.model";
import { QueryBus } from "@nestjs/cqrs";

@Injectable()
export class MainService {
  constructor(
    private readonly qbus: QueryBus,
    private readonly userRepository: UserRepository,
  ) {}

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
