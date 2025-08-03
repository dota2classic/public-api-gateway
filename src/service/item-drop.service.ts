import { Injectable, Logger } from "@nestjs/common";
import { NotificationService } from "../rest/notification/notification.service";
import { ForumApi } from "../generated-api/forum";
import { ItemDroppedEvent } from "../gateway/events/item-dropped.event";
import {
  NotificationEntityType,
  NotificationType,
} from "../entity/notification.entity";
import {
  TradeBotItemQuality,
  TradeBotItemRarity,
} from "../generated-api/tradebot";
import { MarketItemDto } from "../rest/itemdrop/item-drop.dto";

@Injectable()
export class ItemDropService {
  private logger = new Logger(ItemDropService.name);
  constructor(
    private readonly notification: NotificationService,
    private readonly forumApi: ForumApi,
  ) {}

  public async onItemDrop(evt: ItemDroppedEvent) {
    await this.notification.createNotification(
      evt.steamId,
      JSON.stringify({
        marketHashName: evt.item.marketHashName,
        quality: evt.item.quality as TradeBotItemQuality,
        type: evt.item.type,
        image: `https://community.fastly.steamstatic.com/economy/image/${evt.item.icon}`,
        rarity: evt.item.rarity as TradeBotItemRarity,
      } satisfies MarketItemDto),
      NotificationEntityType.PLAYER,
      NotificationType.ITEM_DROPPED,
    );

    try {
      // Send a message to all chat
      await this.forumApi.forumControllerPostMessage(
        "forum_17aa3530-d152-462e-a032-909ae69019ed",
        {
          content: `Игроку https://dotaclassic.ru/players/${evt.steamId} выпала награда "${evt.item.marketHashName}" за игру в матче https://dotaclassic.ru/matches/${evt.matchId}\n https://community.fastly.steamstatic.com/economy/image/${evt.item.icon}/item.png`,
          author: {
            steam_id: "159907143",
            roles: [],
          },
        },
      );
    } catch (e) {
      this.logger.warn(
        "There wa an issue sending message that item dropped!",
        e,
      );
    }
  }
}
