import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { TradeApi } from "../../generated-api/tradebot";
import { WithUser } from "../../utils/decorator/with-user";
import {
  CurrentUser,
  CurrentUserDto,
} from "../../utils/decorator/current-user";
import { ItemDropMapper } from "./item-drop.mapper";
import {
  PurchaseWithTradeBalanceDto,
  TradeOfferDto,
  TradeUserDto,
  UpdateTradeLinkDto,
} from "./item-drop.dto";
import { PaymentService } from "../payments/payment.service";
import { SubscriptionProductEntity } from "../../entity/subscription-product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Controller("drops")
@ApiTags("drops")
export class ItemDropController {
  constructor(
    private readonly api: TradeApi,
    private readonly mapper: ItemDropMapper,
    private readonly paymentService: PaymentService,
    @InjectRepository(SubscriptionProductEntity)
    private readonly subscriptionProductEntityRepository: Repository<SubscriptionProductEntity>,
  ) {}

  @WithUser()
  @Get("/item")
  public async getMyDrops(@CurrentUser() user: CurrentUserDto) {
    return this.api
      .tradeControllerGetDrops(user.steam_id)
      .then((all) => all.map(this.mapper.mapDroppedItem));
  }

  @WithUser()
  @Post("item")
  public async claimDrops(@CurrentUser() user: CurrentUserDto) {
    // https://steamcommunity.com/tradeoffer/8314831115/
    return this.api.tradeControllerClaimDrops(user.steam_id);
  }

  @WithUser()
  @Post("user")
  public async updateTradeLink(
    @CurrentUser() user: CurrentUserDto,
    @Body() dto: UpdateTradeLinkDto,
  ): Promise<TradeUserDto> {
    return this.api
      .tradeControllerUpdateUser(user.steam_id, {
        tradeLink: dto.tradeUrl || "",
      })
      .then(this.mapper.mapUser);
  }

  @WithUser()
  @Get("user")
  public async getUser(
    @CurrentUser() user: CurrentUserDto,
  ): Promise<TradeUserDto> {
    return this.api
      .tradeControllerGetUser(user.steam_id)
      .then(this.mapper.mapUser);
  }

  @WithUser()
  @Get("user/trades")
  public async getTrades(
    @CurrentUser() user: CurrentUserDto,
  ): Promise<TradeOfferDto[]> {
    return this.api
      .tradeControllerGetOfferHistory(user.steam_id)
      .then((offers) => offers.map(this.mapper.mapOffer));
  }

  @WithUser()
  @Post("user/subscription")
  public async purchaseSubscriptionWithTradeBalance(
    @CurrentUser() user: CurrentUserDto,
    @Body() dto: PurchaseWithTradeBalanceDto,
  ): Promise<TradeUserDto> {
    const balance = await this.getUser(user);
    const product = await this.subscriptionProductEntityRepository.findOne({
      where: {
        id: dto.productId,
      },
    });

    const purchasePrice = product.months * product.price;
    if (balance.balance < purchasePrice) {
      throw "Недостаточный баланс!";
    }

    const paymentId = `Trade balance purchase ${new Date().toISOString()} by ${user.steam_id}`;

    await this.api.tradeControllerPurchase(user.steam_id, {
      amount: purchasePrice,
    });

    const payment = await this.paymentService.createPayment(
      user.steam_id,
      dto.productId,
    );
    await this.paymentService.handleSuccessfulPayment(payment.id, paymentId);
    return this.getUser(user);
  }

  @WithUser()
  @Delete("/item/:id")
  public async discardDrop(
    @CurrentUser() user: CurrentUserDto,
    @Param("id") assetId: string,
  ) {
    await this.api.tradeControllerDiscardDrop(user.steam_id, assetId);
  }
}
