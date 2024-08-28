import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HeroSummaryDto } from './dto/meta.dto';
import { MetaApi } from '../../generated-api/gameserver';
import { GAMESERVER_APIURL } from '../../utils/env';
import { HttpCacheInterceptor } from '../../utils/cache-key-track';
import { CacheTTL } from '@nestjs/cache-manager';

@Controller('meta')
@ApiTags('meta')
@UseInterceptors(HttpCacheInterceptor)
export class MetaController {
  private ms: MetaApi;

  constructor() {
    this.ms = new MetaApi(undefined, `http://${GAMESERVER_APIURL}`);
  }

  @CacheTTL(10)
  @Get('heroes')
  public async heroes(): Promise<HeroSummaryDto[]> {
    return this.ms.metaControllerHeroes().then(t => t.data);
  }
}
