import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { CurrentUserDto } from '../../utils/decorator/current-user';

export interface D2CUser {
  steam_id: string;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: 'secretdotakey:)',
    });
  }

  async validate(payload: any): Promise<CurrentUserDto> {
    return {
      steam_id: payload.sub,
      role: payload.role,
    };
  }
}
