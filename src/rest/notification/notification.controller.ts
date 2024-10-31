import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import * as webpush from 'web-push';
import { VAPID_PRIVATE_KEY, VAPID_PUBLIC_KEY } from '../../utils/env';
import { ApiTags } from '@nestjs/swagger';
import { SubscriptionDto } from './notification.dto';

@Controller('notification')
@ApiTags('notification')
export class NotificationController {
  private subs: Map<string, SubscriptionDto> = new Map();

  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {
    webpush.setVapidDetails(
      'mailto:enchantinggg4@gmail.com',
      VAPID_PUBLIC_KEY(),
      VAPID_PRIVATE_KEY(),
    );
  }

  @Post('/subscribe')
  async subscribe(@Body() sub: SubscriptionDto) {
    // Save subscription to redis timelessly
    console.log('SAve sub', sub);

    this.subs.set(sub.keys.auth, sub);

    return 200;
  }

  @Get('test')
  async test() {
    console.log(this.subs);

    const prom = Array.from(this.subs.values()).map(subscription => {
      const pushPayload = JSON.stringify({ hello: 'world' });
      return webpush.sendNotification(subscription, pushPayload);
    });

    await Promise.all(prom);
    return this.subs;
  }
}
