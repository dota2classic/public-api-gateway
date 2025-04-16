import { Inject, Injectable, Logger } from "@nestjs/common";
import Keyv from "keyv";
import { PlayerApi } from "../../generated-api/gameserver";
import { QueryBus } from "@nestjs/cqrs";
import { GameServerAdapter } from "../adapter/gameserver.adapter";
import { UserAdapter } from "../adapter/user.adapter";
import { UserProfileFastService } from "@dota2classic/caches/dist/service/user-profile-fast.service";
import { UserFastProfileDto } from "../../gateway/caches/user-fast-profile.dto";
import { UserDTO } from "../../rest/shared.dto";

@Injectable()
export class UserProfileService {
  private logger = new Logger(UserProfileService.name);

  constructor(
    @Inject("full-profile") private readonly keyv: Keyv,
    private readonly playerApi: PlayerApi,
    private readonly qbus: QueryBus,
    private readonly gsAdapter: GameServerAdapter,
    private readonly userAdapter: UserAdapter,
    private readonly fastUserService: UserProfileFastService<UserFastProfileDto>,
  ) {}

  public userDto = async (steamId: string): Promise<UserDTO> =>
    this.fastUserService.get(steamId).then((it) => ({
      steamId: steamId,
      name: it?.name || "Loading",
      avatar: it?.avatar || "",
      roles: it?.roles || [],
      avatarSmall: (it?.avatar || "").replace("_full", "_medium"),
    }));

  public name = async (steamId: string) =>
    this.fastUserService.get(steamId).then((it) => it.name);
}
