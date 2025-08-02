import { Injectable } from "@nestjs/common";
import {
  TradeBotDroppedItemDto,
  TradeBotMarketItemDto,
  TradeBotTradeOfferDto,
  TradeBotUserDto,
} from "../../generated-api/tradebot";
import {
  DroppedItemDto,
  MarketItemDto,
  TradeOfferDto,
  TradeUserDto,
} from "./item-drop.dto";

@Injectable()
export class ItemDropMapper {
  public mapMarketItem = (item: TradeBotMarketItemDto): MarketItemDto => ({
    marketHashName: item.marketHashName,
    quality: item.quality,
    rarity: item.rarity,
    type: item.type,
    image: item.icon
      ? `https://community.fastly.steamstatic.com/economy/image/${item.icon}`
      : "",
  });

  public mapDroppedItem = (item: TradeBotDroppedItemDto): DroppedItemDto => {
    return {
      assetId: item.assetId,
      matchId: item.matchId,
      item: this.mapMarketItem(item.item),
      expires: item.expires,
      droppedAt: item.droppedAt,
      activeTradeId: item.activeTradeId,
    };
  };

  public mapUser = (user: TradeBotUserDto): TradeUserDto => ({
    tradeUrl: user.tradeLink,
    steamId: user.steamId,
    balance: user.balance,
  });

  public mapOffer = (offer: TradeBotTradeOfferDto): TradeOfferDto => ({
    ...offer,
  });
}
