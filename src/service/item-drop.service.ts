import { Injectable } from "@nestjs/common";
import { NotificationService } from "../rest/notification/notification.service";
import { ForumApi } from "../generated-api/forum";
import { ItemDroppedEvent } from "../gateway/events/item-dropped.event";
import {
  NotificationEntityType,
  NotificationType,
} from "../entity/notification.entity";

@Injectable()
export class ItemDropService {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly forumApi: ForumApi,
  ) {}

  public async onItemDrop(evt: ItemDroppedEvent) {
    await this.notificationService.createNotification(
      evt.steamId,
      evt.steamId,
      NotificationEntityType.PLAYER,
      NotificationType.ITEM_DROPPED,
    );
    // Send a message to all chat
    await this.forumApi.forumControllerPostMessage(
      "forum_17aa3530-d152-462e-a032-909ae69019ed",
      {
        content: `Игроку https://dotaclassic.ru/players/${evt.steamId} выпала награда "${evt.item.marketHashName}" за игру в матче ${evt.matchId}!`,
        author: {
          steam_id: "159907143",
          roles: [],
        },
      },
    );
  }
}
