import { Controller, Get, Param, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
  HeroItemDto,
  HeroPlayerDto,
  HeroSummaryDto,
  ItemDto,
  ItemHeroDto,
} from "./dto/meta.dto";
import { MetaApi, PlayerApi } from "../../generated-api/gameserver";
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
    private readonly ps: PlayerApi,
    private readonly ms: MetaApi,
  ) {}

  @CacheTTL(60 * 30) // 30m cache
  @Get("heroes")
  public async heroes(): Promise<HeroSummaryDto[]> {
    return this.ms.metaControllerHeroes().then((t) => t);
  }

  @CacheTTL(60 * 30) // 30m cache
  @Get("hero/:hero")
  public async hero(@Param("hero") hero: string): Promise<HeroItemDto[]> {
    return this.ms.metaControllerHeroData(hero).then((it) => it);
  }

  @CacheTTL(60 * 30) // 30m cache
  @Get("item/:item")
  public async item(@Param("item") item: number): Promise<ItemHeroDto[]> {
    return this.ms.metaControllerItemData(item).then((it) => it);
  }

  @CacheTTL(60 * 30) // 30m cache
  @Get("items")
  public async items(): Promise<ItemDto[]> {
    return this.ms.metaControllerItems();
  }

  @CacheTTL(60 * 15) // 30m cache
  @Get("hero/:hero/players")
  public async heroPlayers(
    @Param("hero") hero: string,
  ): Promise<HeroPlayerDto[]> {
    const d = await this.ps.playerControllerGetHeroPlayers(hero);
    return await Promise.all(d.map(this.mapper.mapHeroPlayer));
  }
}
