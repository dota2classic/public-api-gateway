import { PassportStrategy } from '@nestjs/passport';
import { Strategy as SteamStrategyT } from 'passport-steam';
import { Injectable } from '@nestjs/common';
import { backUrl } from '../../utils/utils';

@Injectable()
export default class SteamStrategy extends PassportStrategy(SteamStrategyT) {
  constructor() {
    super({
      returnURL: `${backUrl}/v1/auth/steam/callback`,
      // returnURL: `${frontUrl}/steam_callback`,
      realm: `${backUrl}/`,
      apiKey: '5944065088CFEF1A24F74BE1C4C1E7AE',
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
