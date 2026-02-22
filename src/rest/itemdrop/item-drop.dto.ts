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

export class DropTierDto {
  minPrice: number;
  maxPrice: number;
  id: number;
  weight: number;
}

export class UpdateDropTierDto {
  minPrice?: number;
  maxPrice?: number;
  weight?: number;
}

export class CreateDropDto {
  playerId: string;
  tierId: number;
}

export class CreateDropTierDto {
  minPrice: number;
  maxPrice: number;
  weight: number;
}

export class DropSettingsDto {
  baseDropChance: number;
  subsequentDropChance: number;
  desiredStock: number;
}

export class UpdateDropSettingsDto {
  baseDropChance?: number;
  subsequentDropChance?: number;
  desiredStock?: number;
}
