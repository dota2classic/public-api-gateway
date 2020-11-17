import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as DiscordStrategyT } from 'passport-discord';
import { backUrl } from '../../utils/utils';

@Injectable()
export class DiscordStrategy extends PassportStrategy(DiscordStrategyT) {
  constructor() {
    super(
      {
        clientID: '724025468654977155',
        clientSecret: 'K130WorBqCszpYHxnYyYf08s7bwohRjN',
        callbackURL: `${backUrl}/v1/auth/discord/callback`,
        scope: ['identify'],
      },
      async (accessToken, refreshToken, profile, cb) => {
        const user = await this.authService.getOrCreateDiscord(profile.id);
        cb(null, user);
      },
    );
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (...args: any[]) => void,
  ): Promise<any> {
    const user = await this.authService.getOrCreateDiscord(profile.id);
    done(null, user);
  }
}
