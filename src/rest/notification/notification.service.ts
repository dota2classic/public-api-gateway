import { Injectable, Logger } from "@nestjs/common";
import { SubscriptionDto } from "./notification.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { WebpushSubscriptionEntity } from "../../entity/webpush-subscription.entity";
import { In, Not, Repository, SelectQueryBuilder } from "typeorm";
import { QueryBus } from "@nestjs/cqrs";
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
import { NotificationEntity } from "../../entity/notification.entity";
import { Cron, CronExpression } from "@nestjs/schedule";

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
    const inQueue = qs.entries
      .filter((t) => t.modes.includes(mode))
      .reduce((a, b) => a + b.players.length, 0);

    const alreadyInQueue = qs.entries
      .filter((t) => t.modes.includes(mode))
      .flatMap((t) => t.players);

    return await this.delivery.broadcastPredicate(
      (steamId) => !alreadyInQueue.includes(steamId),
      MessageTypeS2C.GO_QUEUE,
      new PleaseEnterQueueMessageS2C(mode, Dota2Version.Dota_684, inQueue),
    );
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  public async expireNotifications() {
    const ur = await this.notificationEntityRepository
      .createQueryBuilder("n")
      .update<NotificationEntity>(NotificationEntity)
      .set({ acknowledged: true })
      .where("created_at + ttl <= now()")
      .andWhere("acknowledged = false")
      .execute();
    this.logger.log(`Expired ${ur.affected} notifications`);
  }

  public async getNotifications(steamId: string, cnt: number = 20) {
    return this.getBaseNotificationQuery()
      .where("n.steam_id = :steamId", { steamId })
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

  private getBaseNotificationQuery(): SelectQueryBuilder<NotificationEntity> {
    return this.notificationEntityRepository
      .createQueryBuilder("n")
      .leftJoinAndMapOne(
        "n.playerFeedback",
        "player_feedback_entity",
        "pfe",
        `pfe.id = n.entity_id`,
      )
      .leftJoinAndMapOne(
        "n.feedback",
        "feedback_entity",
        "fe",
        "fe.tag = pfe.feedback_tag",
      )
      .addSelect("n.created_at + n.ttl", "expiresAt")
      .printSql();
  }
}
