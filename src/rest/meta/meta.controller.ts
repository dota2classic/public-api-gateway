import { Controller, Get, Param, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
  HeroItemDto,
  HeroPlayerDto,
  HeroSummaryDto,
  ItemDto,
  ItemHeroDto,
} from "./dto/meta.dto";
import { ApiClient } from "@dota2classic/gs-api-generated/dist/module";
import { CacheTTL } from "@nestjs/cache-manager";
import { MetaMapper } from "./meta.mapper";
import { ReqLoggingInterceptor } from "../../middleware/req-logging.interceptor";
import { GlobalHttpCacheInterceptor } from "../../utils/cache-global";

@UseInterceptors(ReqLoggingInterceptor, GlobalHttpCacheInterceptor)
@Controller("meta")
@ApiTags("meta")
export class MetaController {
  constructor(
    private readonly mapper: MetaMapper,
    private readonly gsApi: ApiClient,
  ) {}

  @CacheTTL(60 * 30) // 30m cache
  @Get("heroes")
  public async heroes(): Promise<HeroSummaryDto[]> {
    const res = await this.gsApi.meta.metaControllerHeroes();
    return res.data;
  }

  @CacheTTL(60 * 30) // 30m cache
  @Get("hero/:hero")
  public async hero(@Param("hero") hero: string): Promise<HeroItemDto[]> {
    const res = await this.gsApi.meta.metaControllerHeroData(hero);
    return res.data;
  }

  @CacheTTL(60 * 30) // 30m cache
  @Get("item/:item")
  public async item(@Param("item") item: number): Promise<ItemHeroDto[]> {
    const res = await this.gsApi.meta.metaControllerItemData(item);
    return res.data;
  }

  @CacheTTL(60 * 30) // 30m cache
  @Get("items")
  public async items(): Promise<ItemDto[]> {
    const res = await this.gsApi.meta.metaControllerItems();
    return res.data;
  }

  @CacheTTL(60 * 15) // 30m cache
  @Get("hero/:hero/players")
  public async heroPlayers(
    @Param("hero") hero: string,
  ): Promise<HeroPlayerDto[]> {
    const res = await this.gsApi.player.playerControllerGetHeroPlayers(hero);
    return await Promise.all(res.data.map(this.mapper.mapHeroPlayer));
  }
}
