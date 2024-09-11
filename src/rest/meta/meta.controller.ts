import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HeroItemDto, HeroPlayerDto, HeroSummaryDto } from './dto/meta.dto';
import { MetaApi, PlayerApi } from '../../generated-api/gameserver';
import { GAMESERVER_APIURL } from '../../utils/env';
import { HttpCacheInterceptor } from '../../utils/cache-key-track';
import { CacheTTL } from '@nestjs/cache-manager';
import { MetaMapper } from './meta.mapper';

@Controller('meta')
@ApiTags('meta')
@UseInterceptors(HttpCacheInterceptor)
export class MetaController {
  private ms: MetaApi;
  private ps: PlayerApi;

  constructor(private readonly mapper: MetaMapper) {
    this.ms = new MetaApi(undefined, `http://${GAMESERVER_APIURL}`);
    this.ps = new PlayerApi(undefined, `http://${GAMESERVER_APIURL}`);
  }

  @CacheTTL(10)
  @Get('heroes')
  public async heroes(): Promise<HeroSummaryDto[]> {
    return this.ms.metaControllerHeroes().then(t => t.data);
  }

  @Get('hero/:hero')
  public async hero(@Param('hero') hero: string): Promise<HeroItemDto[]> {
    return this.ms.metaControllerHeroData(hero).then(it => it.data);
  }

  @CacheTTL(1000)
  @Get('hero/:hero/players')
  public async heroPlayers(
    @Param('hero') hero: string,
  ): Promise<HeroPlayerDto[]> {
    const d = await this.ps.playerControllerGetHeroPlayers(hero);
    return await Promise.all(d.data.map(this.mapper.mapHeroPlayer));
  }
}
