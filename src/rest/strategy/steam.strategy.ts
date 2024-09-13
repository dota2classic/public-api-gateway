import { PassportStrategy } from '@nestjs/passport';
import { Strategy as SteamStrategyT } from 'passport-steam';
import { Injectable } from '@nestjs/common';
import { backUrl } from '../../utils/utils';
import { STEAM_KEY } from '../../utils/env';

@Injectable()
export default class SteamStrategy extends PassportStrategy(SteamStrategyT) {
  constructor() {
    super({
      returnURL: `${backUrl}/v1/auth/steam/callback`,
      realm: `${backUrl}/`,
      apiKey: STEAM_KEY,
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
