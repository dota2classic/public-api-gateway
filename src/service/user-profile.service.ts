import { Inject, Injectable, Logger } from "@nestjs/common";
import Keyv from "keyv";
import { QueryBus } from "@nestjs/cqrs";
import { UserProfileFastService } from "@dota2classic/caches/dist/service/user-profile-fast.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserFastProfileDto } from "../gateway/caches/user-fast-profile.dto";
import { UserProfileDecorationPreferencesEntity } from "../entity/user-profile-decoration-preferences.entity";
import { CustomizationMapper } from "../rest/customization/customization.mapper";
import { UserDTO } from "../rest/shared.dto";

@Injectable()
export class UserProfileService {
  private logger = new Logger(UserProfileService.name);

  constructor(
    @Inject("full-profile") private readonly keyv: Keyv,
    private readonly qbus: QueryBus,
    private readonly fastUserService: UserProfileFastService<UserFastProfileDto>,
    @InjectRepository(UserProfileDecorationPreferencesEntity)
    private readonly userProfileDecorationPreferencesEntityRepository: Repository<UserProfileDecorationPreferencesEntity>,
    private readonly customizationMapper: CustomizationMapper,
  ) {}

  public userDto = async (steamId: string): Promise<UserDTO> => {
    const [fu, prefs] = await Promise.combine([
      this.fastUserService.get(steamId),
      this.getProfileDecorations(steamId),
    ]);

    return {
      steamId: steamId,
      name: fu?.name || "Loading",
      avatar: fu?.avatar || "",
      roles:
        fu?.roles.filter((t) => new Date(t.endTime).getTime() > Date.now()) ||
        [],
      connections: fu?.connections || [],
      avatarSmall: (fu?.avatar || "").replace("_full", "_medium"),
      hat: prefs?.hat && this.customizationMapper.mapDecoration(prefs.hat),
      icon: prefs?.icon && this.customizationMapper.mapDecoration(prefs.icon),
      title:
        prefs?.title && this.customizationMapper.mapDecoration(prefs.title),
      chatIconAnimation:
        prefs?.animation &&
        this.customizationMapper.mapDecoration(prefs.animation),
    };
  };

  // @memoize2({ maxAge: 10_000 })
  private async getProfileDecorations(steamId: string) {
    return this.userProfileDecorationPreferencesEntityRepository.findOne({
      where: { steamId },
    });
  }

  public name = async (steamId: string) =>
    this.fastUserService.get(steamId).then((it) => it.name);
}
