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
import { HttpCacheInterceptor } from "../../utils/cache-key-track";
import { CacheTTL } from "@nestjs/cache-manager";
import { MetaMapper } from "./meta.mapper";
import { ReqLoggingInterceptor } from "../../middleware/req-logging.interceptor";

@UseInterceptors(ReqLoggingInterceptor)
@Controller("meta")
@ApiTags("meta")
@UseInterceptors(HttpCacheInterceptor)
export class MetaController {
  constructor(
    private readonly mapper: MetaMapper,
    private readonly ps: PlayerApi,
    private readonly ms: MetaApi,
  ) {}

  @CacheTTL(10)
  @Get("heroes")
  public async heroes(): Promise<HeroSummaryDto[]> {
    return this.ms.metaControllerHeroes().then((t) => t);
  }

  @Get("hero/:hero")
  public async hero(@Param("hero") hero: string): Promise<HeroItemDto[]> {
    return this.ms.metaControllerHeroData(hero).then((it) => it);
  }

  @Get("item/:item")
  public async item(@Param("item") item: number): Promise<ItemHeroDto[]> {
    return this.ms.metaControllerItemData(item).then((it) => it);
  }

  @Get("items")
  public async items(): Promise<ItemDto[]> {
    return this.ms.metaControllerItems();
  }

  @CacheTTL(1000)
  @Get("hero/:hero/players")
  public async heroPlayers(
    @Param("hero") hero: string,
  ): Promise<HeroPlayerDto[]> {
    const d = await this.ps.playerControllerGetHeroPlayers(hero);
    return await Promise.all(d.map(this.mapper.mapHeroPlayer));
  }
}
