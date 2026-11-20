import { Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { UserProfileFastService } from "@dota2classic/caches/dist/service/user-profile-fast.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserFastProfileDto } from "../gateway/caches/user-fast-profile.dto";
import { DecorationPreferencesCache } from "./decoration-preferences.cache";
import { CustomizationMapper } from "../customization/customization.mapper";
import { UserDTO } from "../shared.dto";
import { PlayerFlagsEntity } from "../database/entities/player-flags.entity";
import { UserProfileDecorationPreferencesEntity } from "../database/entities/user-profile-decoration-preferences.entity";
import { memoize2 } from "../utils/memoize";

@Injectable()
export class UserProfileService {
  constructor(
    @Inject("REDIS") private readonly redis: Redis,
    private readonly fastUserService: UserProfileFastService<UserFastProfileDto>,
    private readonly decorations: DecorationPreferencesCache,
    private readonly customizationMapper: CustomizationMapper,
    @InjectRepository(PlayerFlagsEntity)
    private readonly playerFlagsEntityRepository: Repository<PlayerFlagsEntity>,
  ) {}

  public userDtos = async (steamIds: string[]): Promise<UserDTO[]> => {
    const byId = await this.userDtoMap(steamIds);
    return steamIds.map((steamId) => byId.get(steamId));
  };

  public userDtoMap = async (steamIds: Iterable<string>): Promise<Map<string, UserDTO>> => {
    const unique = [...new Set(steamIds)];
    const [profiles, prefs, removed] = await Promise.all([
      this.fastProfiles(unique),
      Promise.all(unique.map(this.preferences)),
      this.legallyRemoved(),
    ]);
    return new Map(
      unique.map((steamId, i) => [
        steamId,
        this.toUserDto(steamId, profiles[i], prefs[i], removed.has(steamId)),
      ]),
    );
  };

  public userDto = async (steamId: string): Promise<UserDTO> => {
    const [fu, prefs, removed] = await Promise.all([
      this.fastUserService.get(steamId),
      this.preferences(steamId),
      this.legallyRemoved(),
    ]);
    return this.toUserDto(steamId, fu, prefs, removed.has(steamId));
  };

  public name = async (steamId: string) =>
    this.fastUserService.get(steamId).then((it) => it.name);

  private toUserDto = (
    steamId: string,
    fu: UserFastProfileDto | undefined,
    prefs: UserProfileDecorationPreferencesEntity | undefined,
    removed: boolean,
  ): UserDTO => {
    const avatar = removed ? "" : fu?.avatar || "";
    return {
      steamId: steamId,
      name: removed ? "Removed" : fu?.name || "Loading",
      avatar,
      roles:
        fu?.roles.filter((t) => new Date(t.endTime).getTime() > Date.now()) ||
        [],
      connections: removed ? [] : fu?.connections || [],
      avatarSmall: avatar.replace("_full", "_medium"),
      hat: prefs?.hat && this.customizationMapper.mapDecoration(prefs.hat),
      icon: prefs?.icon && this.customizationMapper.mapDecoration(prefs.icon),
      title:
        prefs?.title && this.customizationMapper.mapDecoration(prefs.title),
      chatIconAnimation:
        prefs?.animation &&
        this.customizationMapper.mapDecoration(prefs.animation),
    };
  };

  private preferences = (steamId: string) =>
    this.decorations.get(steamId).catch(() => undefined);

  private fastProfiles = async (
    steamIds: string[],
  ): Promise<(UserFastProfileDto | undefined)[]> => {
    if (steamIds.length === 0) return [];
    const raws = await this.redis.mget(
      steamIds.map((steamId) => `${this.fastUserService.cacheKey}:${steamId}`),
    );
    return raws.map((raw) => (raw && JSON.parse(raw)) || undefined);
  };

  @memoize2({ maxAge: 10_000, promise: true })
  private async legallyRemoved(): Promise<Set<string>> {
    const rows = await this.playerFlagsEntityRepository.find({
      select: { steamId: true },
      where: { legalRemove: true },
    });
    return new Set(rows.map((row) => row.steamId));
  }
}
