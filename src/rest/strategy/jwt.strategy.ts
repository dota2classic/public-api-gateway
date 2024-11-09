import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { CurrentUserDto } from '../../utils/decorator/current-user';
import { JWT_SECRET } from '../../utils/env';
import { JwtPayload } from '../auth/auth.service';

export interface D2CUser {
  steam_id: string;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<CurrentUserDto> {
    let steam_id = payload.sub;
    // This is fix for deprecated user ids([U:1:xxxx] format)
    if(typeof steam_id === 'string' && steam_id.startsWith('[U:')){
      steam_id = steam_id.slice(5, steam_id.length - 1);
    }
    return {
      steam_id: steam_id,
      roles: payload.roles,
    };
  }
}
