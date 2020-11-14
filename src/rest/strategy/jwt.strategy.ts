import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { CurrentUserDto } from '../../utils/decorator/current-user';
import { JWT_SECRET } from '../../utils/env';

export interface D2CUser {
  steam_id: string;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: any): Promise<CurrentUserDto> {
    return {
      steam_id: payload.sub,
      roles: payload.roles,
    };
  }
}
