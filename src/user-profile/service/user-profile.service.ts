import { Injectable, Logger } from "@nestjs/common";
import Keyv from "keyv";
import {
  _UserProfileDataJson,
  UserProfileDto,
  wrapJSON,
} from "../dto/user-profile.dto";
import { Role } from "../../gateway/shared-types/roles";
import { PlayerAspect } from "../../gateway/shared-types/player-aspect";
import { BanStatus } from "../../gateway/queries/GetPlayerInfo/get-player-info-query.result";
import { UserEntry } from "../../gateway/queries/GetAll/get-all-query.result";
import { PlayerApi } from "../../generated-api/gameserver";
import { MatchAccessLevel } from "../../gateway/shared-types/match-access-level";
import { QueryBus } from "@nestjs/cqrs";
import { PlayerId } from "../../gateway/shared-types/player-id";
import { DeepPartial } from "typeorm";
import { mergeDeep } from "../../utils/merge";
import { GetReportsAvailableQuery } from "../../gateway/queries/GetReportsAvailable/get-reports-available.query";
import { GetReportsAvailableQueryResult } from "../../gateway/queries/GetReportsAvailable/get-reports-available-query.result";
import { GameServerAdapter } from "../adapter/gameserver.adapter";
import { validateAgainstGood } from "../../utils/validate-basic-json";
import { UserAdapter } from "../adapter/user.adapter";
import { memoize2 } from "../../utils/memoize";
import { Memoized } from "memoizee";

@Injectable()
export class UserProfileService {
  private logger = new Logger(UserProfileService.name);

  constructor(
    private readonly keyv: Keyv,
    private readonly playerApi: PlayerApi,
    private readonly qbus: QueryBus,
    private readonly gsAdapter: GameServerAdapter,
    private readonly userAdapter: UserAdapter,
  ) {}

  @memoize2({ maxAge: 10_000, preFetch: true })
  public async get(steamId: string): Promise<UserProfileDto> {
    let profile = await this.keyv.get<_UserProfileDataJson>(steamId);
    if (profile) {
      try {
        if (this.validateJsonAgainstDefault(profile)) {
          return wrapJSON(profile);
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
        this.logger.error("Couldn't create full profile from scratch", e)
        profile = this.makeProfile(steamId);
      }
      await this.save(profile);
    }
    return wrapJSON(profile);
  }

  public updateSteamProfile = async (entry: UserEntry) => {
    const profile = await this.get(entry.id.value);
    profile.user = {
      ...profile.user,
      avatar: entry.avatar,
      roles: entry.roles,
      name: entry.name,
    };
    await this.save(profile);
  };

  public createFullProfileFromScratch = async (
    steamId: string,
  ): Promise<_UserProfileDataJson> => {
    const u = await this.qbus.execute<
      GetReportsAvailableQuery,
      GetReportsAvailableQueryResult
    >(new GetReportsAvailableQuery(new PlayerId(steamId)));

    const userData = await this.userAdapter.resolveUser(steamId);
    const gsData = await this.gsAdapter.resolveSummary(steamId);

    return {
      user: userData.user,
      reports: {
        reportsAvailable: u.available,
      },
      player: gsData.player,
      forum: {},
    };
  };

  public updateSummary = async (steamId: string) => {
    this.gsAdapter
      .resolveSummary(steamId)
      .then((data) => this.merge(steamId, data));
  };

  public userDto = async (steamId: string) =>
    this.get(steamId).then((it) => it.asUserDto());

  public name = async (steamId: string) =>
    this.get(steamId).then((it) => it.user.name);

  private validateJsonAgainstDefault(json: _UserProfileDataJson) {
    const good = this.makeProfile("123");
    if (!validateAgainstGood(good, json)) {
      throw "Bad json";
    }
    return true;
  }

  private async save(u: _UserProfileDataJson) {
    this.logger.log(`Updated user profile ${u.user.id}`);
    await this.keyv.set(u.user.id, u, 60_000); // 1 min ttl is good enough maybe?
    (
      this.get as unknown as Memoized<(sid: string) => Promise<UserProfileDto>>
    ).delete(u.user.id);
  }

  private async merge(id: string, u: DeepPartial<UserProfileDto>) {
    const full = await this.get(id);
    mergeDeep(full, u);
    await this.save(full);
  }

  private makeProfile(steamId: string): _UserProfileDataJson {
    return {
      user: {
        id: steamId,
        name: "Loading",
        avatar: "",
        roles: [Role.PLAYER],
      },
      reports: {
        reportsAvailable: 0,
      },
      player: {
        mmr: -1,
        rank: -1,
        calibrationGamesLeft: 10,
        accessLevel: MatchAccessLevel.EDUCATION,

        kills: 0,
        deaths: 0,
        assists: 0,
        win: 0,
        loss: 0,
        abandon: 0,
        games: 0,
        playtime: 0,
        aspects: Object.keys(PlayerAspect)
          .filter((key) => isNaN(Number(key)))
          .map((aspect) => ({
            aspect: PlayerAspect[aspect],
            count: 0,
          })),
        ban: BanStatus.NOT_BANNED,
      },
      forum: {},
    };
  }
}
