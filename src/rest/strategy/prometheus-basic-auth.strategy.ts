import { BasicStrategy as Strategy } from "passport-http";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { PROMETHEUS_PASSWORD, PROMETHEUS_USER } from "../../utils/env";

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      passReqToCallback: true,
    });
  }

  public validate = async (req, username, password): Promise<boolean> => {
    if (PROMETHEUS_USER() === username && PROMETHEUS_PASSWORD() === password) {
      return true;
    }
    throw new UnauthorizedException();
  };
}
