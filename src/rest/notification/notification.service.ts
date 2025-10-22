import { Inject, Injectable, Logger } from "@nestjs/common";
import { SubscriptionDto } from "./notification.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { WebpushSubscriptionEntity } from "../../entity/webpush-subscription.entity";
import { In, Not, Repository, SelectQueryBuilder } from "typeorm";
import { EventBus, QueryBus } from "@nestjs/cqrs";
import * as webpush from "web-push";
import { MatchmakingMode } from "../../gateway/shared-types/matchmaking-mode";
import { GetQueueStateQueryResult } from "../../gateway/queries/QueueState/get-queue-state-query.result";
import { GetQueueStateQuery } from "../../gateway/queries/QueueState/get-queue-state.query";
import { Dota2Version } from "../../gateway/shared-types/dota2version";
import { ReadyCheckStartedEvent } from "../../gateway/events/ready-check-started.event";
import { SocketDelivery } from "../../socket/socket-delivery";
import { MessageTypeS2C } from "../../socket/messages/s2c/message-type.s2c";
import { PleaseEnterQueueMessageS2C } from "../../socket/messages/s2c/please-enter-queue-message.s2c";
import { ConfigService } from "@nestjs/config";
import {
  NotificationEntity,
  NotificationEntityType,
  NotificationType,
} from "../../entity/notification.entity";
import { Cron, CronExpression } from "@nestjs/schedule";
import { NotificationCreatedEvent } from "./event/notification-created.event";
import { NotificationMapper } from "./notification.mapper";
import { InfoApi } from "../../generated-api/gameserver";
import { ClientProxy } from "@nestjs/microservices";
import Redlock from "redlock";

@Injectable()
export class NotificationService {
  private logger = new Logger(NotificationService.name);
  constructor(
    @InjectRepository(WebpushSubscriptionEntity)
    private readonly webpushSubscriptionEntityRepository: Repository<WebpushSubscriptionEntity>,
    private qbus: QueryBus,
    private readonly delivery: SocketDelivery,
    private readonly config: ConfigService,
    @InjectRepository(NotificationEntity)
    private readonly notificationEntityRepository: Repository<NotificationEntity>,
    private readonly ebus: EventBus,
    private readonly mapper: NotificationMapper,
    @Inject("QueryCore") private readonly redisEventQueue: ClientProxy,
    private readonly redlock: Redlock,
    private readonly ms: InfoApi,
  ) {
    webpush.setVapidDetails(
      "mailto:enchantinggg4@gmail.com",
      config.get("webpush.publicKey"),
      config.get("webpush.privateKey"),
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
        conflictPaths: ["steam_id"],
        skipUpdateIfNoValuesChanged: true,
        upsertType: "on-conflict-do-update",
      },
    );
  }

  public unsubscribe(steamId: string) {
    return this.webpushSubscriptionEntityRepository.delete({
      steam_id: steamId,
    });
  }

  public async notify(payload: any, subs: WebpushSubscriptionEntity[]) {
    return { send: 0, successful: 0 };
    const pushPayload = JSON.stringify(payload);
    const prom = subs.map((subscription) => {
      return webpush
        .sendNotification(subscription.subscription, pushPayload)
        .then(() => 1)
        .catch((e) => {
          this.logger.error(`Error sending push notification: ${e}`);
          return 0;
        });
    });
    const expected = subs.length;
    const actual = (await Promise.all(prom)).reduce((a, b) => a + b, 0);
    return {
      send: expected,
      successful: actual,
    };
  }

  public async createHerePayload(
    mode: MatchmakingMode,
  ): Promise<[any, WebpushSubscriptionEntity[]]> {
    const qs: GetQueueStateQueryResult = await this.qbus.execute(
      new GetQueueStateQuery(Dota2Version.Dota_684),
    );
    const inQueue = qs.entries
      .filter((t) => t.modes.includes(mode))
      .reduce((a, b) => a + b.players.length, 0);

    const alreadyInQueue = qs.entries
      .filter((t) => t.modes.includes(mode))
      .flatMap((t) => t.players);

    const evt = {
      type: "TIME_TO_QUEUE",
      inQueue: inQueue,
      mode: mode,
    };

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
      type: "GAME_READY",
      mode: evt.mode,
    };
    const eligible = await this.webpushSubscriptionEntityRepository.find({
      where: {
        steam_id: In(evt.entries.map((it) => it.steamId)),
      },
    });

    return [body, eligible];
  }

  public async notifyOnliners(mode: MatchmakingMode) {
    const qs: GetQueueStateQueryResult = await this.qbus.execute(
      new GetQueueStateQuery(Dota2Version.Dota_684),
    );

    const inGame: string[] = await this.ms
      .infoControllerGameSessions()
      .then((it) =>
        it.flatMap((ses) => [...ses.info.radiant, ...ses.info.dire]),
      );

    const alreadyInQueue: string[] = qs.entries
      .filter((t) => t.modes.includes(mode))
      .flatMap((t) => t.players);

    const ignorePing = new Set([...inGame, ...alreadyInQueue]);

    const inQueue = qs.entries
      .filter((t) => t.modes.includes(mode))
      .reduce((a, b) => a + b.players.length, 0);

    return await this.delivery.broadcastPredicate(
      (steamId) => !ignorePing.has(steamId),
      MessageTypeS2C.GO_QUEUE,
      new PleaseEnterQueueMessageS2C(mode, Dota2Version.Dota_684, inQueue),
    );
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  public async expireNotifications() {
    await this.redlock.using(
      ["api-gateway-notification-expire"],
      5000,
      async (signal) => {
        const ur = await this.notificationEntityRepository
          .createQueryBuilder("n")
          .update<NotificationEntity>(NotificationEntity)
          .set({ acknowledged: true })
          .where("created_at + ttl <= now()")
          .andWhere("acknowledged = false")
          .execute();

        if (signal.aborted) {
          throw signal.error;
        }

        this.logger.log(`Expired ${ur.affected} notifications`);
      },
    );
  }

  public async getNotifications(steamId: string, cnt: number = 20) {
    return this.getBaseNotificationQuery()
      .where("n.steam_id = :steamId", { steamId })
      .andWhere({ acknowledged: false })
      .orderBy("n.createdAt", "DESC")
      .take(cnt)
      .getMany();
  }

  async acknowledge(id: string, steamId: string) {
    await this.notificationEntityRepository.update(
      {
        id,
        steamId,
      },
      {
        acknowledged: true,
      },
    );
    return this.getFullNotification(id);
  }

  async getFullNotification(id: string) {
    return this.getBaseNotificationQuery().where({ id }).getOneOrFail();
  }

  public async createNotification(
    steamId: string,
    entityId: string,
    entityType: NotificationEntityType,
    type: NotificationType,
    ttl: string = "1day",
    params: Record<string, unknown> = {},
  ) {
    let ne = new NotificationEntity(
      steamId,
      entityId,
      entityType,
      type,
      ttl,
      params,
    );
    ne = await this.notificationEntityRepository.save(ne);
    ne = await this.getFullNotification(ne.id);
    this.logger.log("Emitting NotificationCreatedEvent to redis");
    await this.redisEventQueue.emit(
      NotificationCreatedEvent.name,
      new NotificationCreatedEvent(await this.mapper.mapNotification(ne)),
    );
  }

  private getBaseNotificationQuery(): SelectQueryBuilder<NotificationEntity> {
    return this.notificationEntityRepository
      .createQueryBuilder("n")
      .addSelect("n.created_at + n.ttl", "expiresAt")
      .printSql();
  }
}
