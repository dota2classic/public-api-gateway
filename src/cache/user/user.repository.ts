import { RuntimeRepository } from "../runtime.repository";
import { UserModel } from "./user.model";
import { Injectable } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { GetUserInfoQuery } from "../../gateway/queries/GetUserInfo/get-user-info.query";
import { PlayerId } from "../../gateway/shared-types/player-id";
import { GetUserInfoQueryResult } from "../../gateway/queries/GetUserInfo/get-user-info-query.result";
import { Role } from "../../gateway/shared-types/roles";
import { UserDTO } from "../../rest/shared.dto";

@Injectable()
export class UserRepository extends RuntimeRepository<UserModel, "id"> {
  constructor(private readonly qbus: QueryBus) {
    super(86400);
  }

  async resolve(id: UserModel["id"]): Promise<UserModel> {
    return this.qbus
      .execute<
        GetUserInfoQuery,
        GetUserInfoQueryResult
      >(new GetUserInfoQuery(new PlayerId(id)))
      .then((t) => {
        if (t) {
          const m = new UserModel(t.id.value, t.name, t.avatar, t.roles);
          this.save(t.id.value, m);
          return m;
        } else return undefined;
      });
  }

  public async name(id: UserModel["id"]): Promise<string> {
    return this.get(id).then((t) => t?.name || id);
  }

  public async roles(id: UserModel["id"]): Promise<Role[]> {
    return this.get(id)
      .then((t) => t.roles)
      .catch(() => []);
  }

  public async avatar(id: UserModel["id"]): Promise<string> {
    return this.get(id).then((t) => t.avatar);
  }

  userDto = async (steamId: string): Promise<UserDTO> => {
    const u = await this.get(steamId);
    if (!u) {
      return {
        steamId,
        name: "Username loading",
        avatar: "",
        avatarSmall: "",
        roles: [],
      };
    }
    return {
      steamId,
      name: u.name,
      avatar: u.avatar,
      avatarSmall: (u.avatar || "").replace("_full", "_medium"),
      roles: u.roles,
    };
  };
}
