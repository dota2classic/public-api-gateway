import {
  TradeBotItemQuality,
  TradeBotItemRarity,
} from "../../generated-api/tradebot";
import { ApiProperty } from "@nestjs/swagger";

export class MarketItemDto {
  marketHashName: string;

  @ApiProperty({ enum: TradeBotItemQuality, enumName: "ItemQuality" })
  quality: TradeBotItemQuality;

  @ApiProperty({ enum: TradeBotItemRarity, enumName: "ItemRarity" })
  rarity: TradeBotItemRarity;

  image: string;
  type: string;
}

export class DroppedItemDto {
  assetId: string;
  matchId: number;
  droppedAt: string;
  activeTradeId: string;
  expires: string;
  item: MarketItemDto;
}

export class UpdateTradeLinkDto {
  tradeUrl: string;
}

export class TradeUserDto {
  steamId: string;
  tradeUrl?: string;
  balance: number;
}

export class TradeOfferDto {
  id: string;
  amount: number;
  itemCount: number;
  incoming: boolean;
  createdAt: string;
}

export class PurchaseWithTradeBalanceDto {
  productId: number;
}
