import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { CurrentUserDto } from "../../utils/decorator/current-user";
import { JwtPayload } from "../auth/auth.service";
import { ConfigService } from "@nestjs/config";

export interface D2CUser {
  steam_id: string;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get("api.jwtSecret"),
    });
  }

  async validate(payload: JwtPayload): Promise<CurrentUserDto> {
    let steam_id = payload.sub;
    // This is fix for deprecated user ids([U:1:xxxx] format)
    if (typeof steam_id === "string" && steam_id.startsWith("[U:")) {
      steam_id = steam_id.slice(5, steam_id.length - 1);
    }
    return {
      steam_id: steam_id,
      roles: payload.roles,
    };
  }
}
