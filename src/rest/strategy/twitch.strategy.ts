import { PassportStrategy } from "@nestjs/passport";
import { Strategy as TwitchStrategyT } from "passport-twitch-latest";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export default class TwitchStrategy extends PassportStrategy(TwitchStrategyT) {
  constructor(private readonly config: ConfigService) {
    super({
      callbackURL: `${config.get("api.backUrl")}/v1/auth/twitch/callback`,
      scope: `user_read`,
      clientID: config.get("twitch.clientId"),
      clientSecret: config.get("twitch.secret"),
      authorizationURL: "https://id.twitch.tv/oauth2/authorize",
      tokenURL: "https://id.twitch.tv/oauth2/token",
      forceVerify: true,
    });
  }

  async validate(
    ident: string,
    ident2: any,
    profile: { id },
    done: (...args: any[]) => void,
  ): Promise<any> {
    done(null, profile);
  }
}
