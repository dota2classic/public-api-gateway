import { Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Role } from "../gateway/shared-types/roles";
import { UserProfileService } from "../service/user-profile.service";
import { UserDTO } from "../shared.dto";
import { ConfigService } from "@nestjs/config";
import * as qs from "querystring";
import { steam64to32 } from "../utils/steamIds";
import { EventBus } from "@nestjs/cqrs";
import { UserLoggedInEvent } from "../gateway/events/user/user-logged-in.event";
import { PlayerId } from "../gateway/shared-types/player-id";
import { InjectRepository } from "@nestjs/typeorm";
import { SteamidHwidEntryEntity } from "../database/entities/steamid-hwid-entry.entity";
import { Repository } from "typeorm";

export interface JwtPayload {
  sub: string;
  roles: Role[];
  name: string | undefined;
  avatar: string | undefined;
  version?: "1";
}

interface SteamSessionTokenAuthResponse {
  response: {
    error?: {};
    params?: {
      result: "OK";
      steamid: string;
    };
  };
}

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  // Seconds
  public static REFRESH_TOKEN_EXPIRES_IN = "4d";
  constructor(
    private readonly jwtService: JwtService,
    private readonly user: UserProfileService,
    private readonly config: ConfigService,
    private readonly ebus: EventBus,
    @InjectRepository(SteamidHwidEntryEntity)
    private readonly hwidRepository: Repository<SteamidHwidEntryEntity>,
  ) {}

  public async refreshToken(token: string) {
    const oldToken = this.jwtService.decode<JwtPayload>(token);
    return this.createJwtPayload(oldToken.sub).then((payload) =>
      this.jwtService.sign(payload, {
        expiresIn: AuthService.REFRESH_TOKEN_EXPIRES_IN,
      }),
    );
  }

  public async authorizeSessionTokenLauncher(
    sessionToken: string,
    hwid?: string,
  ): Promise<string | undefined> {
    const q = qs.stringify({
      key: this.config.get("steam.key"),
      ticket: sessionToken,
      appid: 480,
      identity: 'dotaclassic.ru'
    });

    try {
      const res = await fetch(
        `https://api.steampowered.com/ISteamUserAuth/AuthenticateUserTicket/v1/?${q}`,
        {
          method: "GET",
        },
      ).then((it) => it.json());

      const star = res as SteamSessionTokenAuthResponse;
      if (star.response.params.result === "OK") {
        const steamId = star.response.params.steamid;

        const profileQ = qs.stringify({
          key: this.config.get("steam.key"),
          steamids: steamId,
        });
        const profileRes = await fetch(
          `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?${profileQ}`,
        ).then((it) => it.json());

        const player = profileRes?.response?.players?.[0];
        const name: string | undefined = player?.personaname;
        const avatar: string | undefined = player?.avatarfull;

        const steam32id = steam64to32(steamId);
        this.ebus.publish(new UserLoggedInEvent(new PlayerId(steam32id), name, avatar));

        if (hwid) {
          const exists = await this.hwidRepository.existsBy({ steamId: steam32id, hwid });
          if (!exists) {
            const entry = new SteamidHwidEntryEntity();
            entry.steamId = steam32id;
            entry.hwid = hwid;
            await this.hwidRepository.save(entry).catch((e) =>
              this.logger.error("Failed to save hwid entry", e),
            );
          }
        }

        return this.createToken(steam32id, name, avatar);
      }
    } catch (e) {
      this.logger.error("Error validating steam sessson token", e);
      return undefined;
    }
  }

  public async createToken(
    steam_id: string,
    name?: string,
    avatar?: string,
    expiresIn = AuthService.REFRESH_TOKEN_EXPIRES_IN,
  ) {
    const payload = await this.createJwtPayload(steam_id, name, avatar);
    return this.jwtService.sign(payload, {
      expiresIn,
    });
  }

  private async createJwtPayload(
    steam_id: string,
    name?: string,
    avatar?: string,
  ): Promise<JwtPayload> {
    let u: UserDTO | undefined = undefined;
    try {
      u = await this.user.userDto(steam_id);
    } catch (e) {}

    return {
      sub: steam_id,
      roles: u?.roles
        .filter((t) => new Date(t.endTime).getTime() > Date.now())
        .map((t) => t.role) || [Role.PLAYER],
      name: name || u?.name,
      avatar: avatar || u?.avatar,
      version: "1",
    };
  }
}
