import { Inject, Injectable, Logger } from "@nestjs/common";
import Keyv from "keyv";
import { PlayerApi } from "../../generated-api/gameserver";
import { QueryBus } from "@nestjs/cqrs";
import { GameServerAdapter } from "../adapter/gameserver.adapter";
import { UserAdapter } from "../adapter/user.adapter";
import { UserProfileFastService } from "@dota2classic/caches/dist/service/user-profile-fast.service";
import { UserFastProfileDto } from "../../gateway/caches/user-fast-profile.dto";
import { UserDTO } from "../../rest/shared.dto";
import { UserProfileDecorationPreferencesEntity } from "../../entity/user-profile-decoration-preferences.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { StorageMapper } from "../mapper/storage.mapper";

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
    @InjectRepository(UserProfileDecorationPreferencesEntity)
    private readonly userProfileDecorationPreferencesEntityRepository: Repository<UserProfileDecorationPreferencesEntity>,
    private readonly storageMapper: StorageMapper,
  ) {}

  public userDto = async (steamId: string): Promise<UserDTO> => {
    const [fu, prefs] = await Promise.combine([
      this.fastUserService.get(steamId),
      this.userProfileDecorationPreferencesEntityRepository.findOne({
        where: { steamId },
      }),
    ]);

    return {
      steamId: steamId,
      name: fu?.name || "Loading",
      avatar: fu?.avatar || "",
      roles: fu?.roles || [],
      avatarSmall: (fu?.avatar || "").replace("_full", "_medium"),
      hat: prefs?.hat && this.storageMapper.mapS3Item(prefs?.hat.imageKey),
    };
  };

  public name = async (steamId: string) =>
    this.fastUserService.get(steamId).then((it) => it.name);
}
