import { Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Role } from "../../gateway/shared-types/roles";
import { UserProfileService } from "../../service/user-profile.service";
import { UserDTO } from "../shared.dto";
import { ConfigService } from "@nestjs/config";
import * as qs from "querystring";
import { steam64to32 } from "../../utils/steamIds";

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
  ): Promise<string | undefined> {
    const q = qs.stringify({
      key: this.config.get("steam.key"),
      ticket: sessionToken,
      appid: 480,
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
        return this.createToken(steam64to32(steamId));
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
