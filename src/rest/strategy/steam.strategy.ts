import { PassportStrategy } from "@nestjs/passport";
import { Strategy as SteamStrategyT } from "@dota2classic/passport_steam";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export default class SteamStrategy extends PassportStrategy(SteamStrategyT) {
  private logger = new Logger(SteamStrategy.name);
  constructor(private readonly config: ConfigService) {
    super({
      returnUrl: `${config.get("api.backUrl")}/v1/auth/steam/callback`,
      realm: `${config.get("api.backUrl")}/`,
      apiKey: () => config.get("steam.key"),
      fetchSteamLevel: false,
      fetchUserProfile: true,
    });
  }

  async validate(profile: any, done: (...args: any[]) => void): Promise<any> {
    done(null, profile);
  }
}
