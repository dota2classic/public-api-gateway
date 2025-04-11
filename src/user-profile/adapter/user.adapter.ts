import { QueryBus } from "@nestjs/cqrs";
import { Injectable } from "@nestjs/common";
import { GetUserInfoQuery } from "../../gateway/queries/GetUserInfo/get-user-info.query";
import { GetUserInfoQueryResult } from "../../gateway/queries/GetUserInfo/get-user-info-query.result";
import { PlayerId } from "../../gateway/shared-types/player-id";
import { _UserProfileDataJson } from "../dto/user-profile.dto";

@Injectable()
export class UserAdapter {
  constructor(private readonly qbus: QueryBus) {}

  public async resolveUser(
    steamId: string,
  ): Promise<{ user: _UserProfileDataJson["user"] }> {
    const res = await this.qbus.execute<
      GetUserInfoQuery,
      GetUserInfoQueryResult
    >(new GetUserInfoQuery(new PlayerId(steamId)));

    return {
      user: {
        id: steamId,
        name: res.name,
        avatar: res.avatar,
        roles: res.roles,
      },
    };
  }
}
