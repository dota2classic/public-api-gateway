import { Inject, Injectable, Logger } from "@nestjs/common";
import Keyv from "keyv";
import { UserProfileFastService } from "@dota2classic/caches/dist/service/user-profile-fast.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserFastProfileDto } from "../gateway/caches/user-fast-profile.dto";
import { DecorationPreferencesCache } from "./decoration-preferences.cache";
import { CustomizationMapper } from "../customization/customization.mapper";
import { UserDTO } from "../shared.dto";
import { PlayerFlagsEntity } from "../database/entities/player-flags.entity";
import { memoize2 } from "../utils/memoize";

@Injectable()
export class UserProfileService {
  private logger = new Logger(UserProfileService.name);

  constructor(
    @Inject("full-profile") private readonly keyv: Keyv,
    private readonly fastUserService: UserProfileFastService<UserFastProfileDto>,
    private readonly decorations: DecorationPreferencesCache,
    private readonly customizationMapper: CustomizationMapper,
    @InjectRepository(PlayerFlagsEntity)
    private readonly playerFlagsEntityRepository: Repository<PlayerFlagsEntity>,
  ) {}

  public userDtos = async (steamIds: string[]): Promise<UserDTO[]> => {
    const unique = [...new Set(steamIds)];
    const dtos = await Promise.all(unique.map(this.userDto));
    const byId = new Map(unique.map((steamId, index) => [steamId, dtos[index]]));
    return steamIds.map((steamId) => byId.get(steamId));
  };

  public userDto = async (steamId: string): Promise<UserDTO> => {
    const [fu, prefs, flags] = await Promise.all([
      this.fastUserService.get(steamId),
      this.decorations.get(steamId).catch(() => undefined),
      this.getPlayerFlags(steamId),
    ]);

    if (flags?.legalRemove) {
      fu.name = "Removed";
      fu.avatar = "";
      fu.connections = [];
    }

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

  @memoize2({ maxAge: 10_000, primitive: true })
  private async getPlayerFlags(steamId: string) {
    return this.playerFlagsEntityRepository.findOne({
      where: { steamId },
    });
  }

  public name = async (steamId: string) =>
    this.fastUserService.get(steamId).then((it) => it.name);
}
