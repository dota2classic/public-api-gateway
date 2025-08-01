import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { TradeApi } from "../../generated-api/tradebot";
import { WithUser } from "../../utils/decorator/with-user";
import {
  CurrentUser,
  CurrentUserDto,
} from "../../utils/decorator/current-user";
import { ItemDropMapper } from "./item-drop.mapper";
import { TradeUserDto, UpdateTradeLinkDto } from "./item-drop.dto";

@Controller("drops")
@ApiTags("drops")
export class ItemDropController {
  constructor(
    private readonly api: TradeApi,
    private readonly mapper: ItemDropMapper,
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
  @Delete("/item/:id")
  public async discardDrop(
    @CurrentUser() user: CurrentUserDto,
    @Param("id") assetId: string,
  ) {
    await this.api.tradeControllerDiscardDrop(user.steam_id, assetId);
  }
}
