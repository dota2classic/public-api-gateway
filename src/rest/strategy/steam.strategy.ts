import { PassportStrategy } from "@nestjs/passport";
import { Strategy as SteamStrategyT } from "passport-steam";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export default class SteamStrategy extends PassportStrategy(SteamStrategyT) {
  constructor(private readonly config: ConfigService) {
    super({
      returnURL: `${config.get("api.backUrl")}/v1/auth/steam/callback`,
      realm: `${config.get("api.backUrl")}/`,
      apiKey: config.get("steam.key"),
    });
  }

  async validate(
    ident: string,
    profile: any,
    done: (...args: any[]) => void,
  ): Promise<any> {
    done(null, profile);
  }
}
