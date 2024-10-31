import { PushSubscription } from 'web-push';

export class SubscriptionDto implements PushSubscription {
  endpoint: string;
  expirationTime: number | null;
  keys: { p256dh: string; auth: string };
}
