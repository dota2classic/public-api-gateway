import { Inject, Injectable, Logger } from "@nestjs/common";
import Keyv from "keyv";
import { memoize2 } from "../../utils/memoize";
import { UserProfileDto } from "../dto/user-profile.dto";
import { UserDTO } from "../../rest/shared.dto";
import { UserAdapter } from "../adapter/user.adapter";
import { Role } from "../../gateway/shared-types/roles";
import { Memoized } from "memoizee";
import { validateAgainstGood } from "../../utils/validate-basic-json";
import { UserEntry } from "../../gateway/queries/GetAll/get-all-query.result";

@Injectable()
export class UserProfileFastService {
  private logger = new Logger(UserProfileFastService.name);

  constructor(
    @Inject("fast-user-profile") private readonly keyv: Keyv,
    private readonly userAdapter: UserAdapter,
  ) {}

  private static mapUserEntry = (user: UserEntry): UserDTO => {
    return {
      name: user.name,
      avatar: user.avatar,
      avatarSmall: (user.avatar || "").replace("_full", "_medium"),
      steamId: user.id.value,
      roles: user.roles,
    };
  };

  @memoize2({ maxAge: 10_000, preFetch: true })
  public async get(steamId: string): Promise<UserDTO> {
    let profile = await this.keyv.get<UserDTO>(steamId);
    if (profile) {
      try {
        if (this.validateJsonAgainstDefault(profile)) {
          return profile;
        }
      } catch (e) {
        this.logger.warn("Stale json schema in redis, revalidating", steamId);
        // outdated invalid json
        profile = undefined;
      }
    }
    if (!profile) {
      try {
        profile = await this.createFullProfileFromScratch(steamId);
      } catch (e) {
        this.logger.error("Couldn't create full profile from scratch", e);
        profile = this.makeProfile(steamId);
      }
      await this.save(profile);
    }
    return profile;
  }

  public updateSteamProfile = async (entry: UserEntry) => {
    await this.save(UserProfileFastService.mapUserEntry(entry));
  };

  private async save(u: UserDTO) {
    this.logger.log(`Updated user profile ${u.steamId}`);
    await this.keyv.set(u.steamId, u, 60_000); // 1 min ttl is good enough maybe?
    (
      this.get as unknown as Memoized<(sid: string) => Promise<UserProfileDto>>
    ).delete(u.steamId);
  }

  private async createFullProfileFromScratch(
    steamId: string,
  ): Promise<UserDTO> {
    const { user } = await this.userAdapter.resolveUser(steamId);
    return UserProfileFastService.mapUserEntry({
      id: { value: user.id },
      name: user.name,
      avatar: user.avatar,
      roles: user.roles,
    });
  }

  private makeProfile(steamId: string): UserDTO {
    return {
      steamId: steamId,
      name: "Loading",
      avatar: "",
      avatarSmall: "",
      roles: [Role.PLAYER],
    };
  }

  private validateJsonAgainstDefault(json: UserDTO) {
    const good = this.makeProfile("123");
    if (!validateAgainstGood(good, json)) {
      throw "Bad json";
    }
    return true;
  }
}
