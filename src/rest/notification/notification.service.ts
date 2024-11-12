import { Injectable } from '@nestjs/common';
import { SubscriptionDto } from './notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WebpushSubscriptionEntity } from '../../entity/webpush-subscription.entity';
import { In, Not, Repository } from 'typeorm';
import { QueryBus } from '@nestjs/cqrs';
import * as webpush from 'web-push';
import { VAPID_PRIVATE_KEY, VAPID_PUBLIC_KEY } from '../../utils/env';
import { MatchmakingMode } from '../../gateway/shared-types/matchmaking-mode';
import { GetQueueStateQueryResult } from '../../gateway/queries/QueueState/get-queue-state-query.result';
import { GetQueueStateQuery } from '../../gateway/queries/QueueState/get-queue-state.query';
import { Dota2Version } from '../../gateway/shared-types/dota2version';
import { ReadyCheckStartedEvent } from '../../gateway/events/ready-check-started.event';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(WebpushSubscriptionEntity)
    private readonly webpushSubscriptionEntityRepository: Repository<
      WebpushSubscriptionEntity
    >,
    private qbus: QueryBus,
  ) {
    webpush.setVapidDetails(
      'mailto:enchantinggg4@gmail.com',
      VAPID_PUBLIC_KEY(),
      VAPID_PRIVATE_KEY(),
    );
  }

  public async subscribe(steamId: string, sub: SubscriptionDto) {
    await this.webpushSubscriptionEntityRepository.upsert(
      [
        {
          steam_id: steamId,
          subscription: sub,
        },
      ],
      {
        conflictPaths: ['steam_id'],
        skipUpdateIfNoValuesChanged: true,
        upsertType: 'on-conflict-do-update',
      },
    );
  }

  public unsubscribe(steamId: string) {
    return this.webpushSubscriptionEntityRepository.delete({
      steam_id: steamId,
    });
  }

  public async notify(payload: any, subs: WebpushSubscriptionEntity[]) {
    const pushPayload = JSON.stringify(payload);
    const prom = subs.map(subscription => {
      return webpush.sendNotification(subscription.subscription, pushPayload);
    });
    return await Promise.all(prom).then(t => t.length);
  }

  public async createHerePayload(
    mode: MatchmakingMode,
  ): Promise<[any, WebpushSubscriptionEntity[]]> {
    const qs: GetQueueStateQueryResult = await this.qbus.execute(
      new GetQueueStateQuery(mode, Dota2Version.Dota_684),
    );
    const inQueue = qs.entries
      .flatMap(t => t.players.length)
      .reduce((a, b) => a + b, 0);
    const evt = {
      type: 'TIME_TO_QUEUE',
      inQueue: inQueue,
      mode: mode,
    };

    const alreadyInQueue = qs.entries
      .flatMap(t => t.players)
      .map(it => it.value);

    const eligible = await this.webpushSubscriptionEntityRepository.find({
      where: {
        steam_id: Not(In(alreadyInQueue)),
      },
    });

    return [evt, eligible];
  }

  public async createGameAcceptPayload(
    evt: ReadyCheckStartedEvent,
  ): Promise<[any, WebpushSubscriptionEntity[]]> {
    const body = {
      type: 'GAME_READY',
      mode: evt.mode,
    };
    const eligible = await this.webpushSubscriptionEntityRepository.find({
      where: {
        steam_id: In(evt.entries.map(it => it.playerId.value)),
      },
    });

    return [body, eligible];
  }
}
