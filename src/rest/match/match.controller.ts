import { CacheInterceptor, Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MatchmakingMode } from '../../gateway/shared-types/matchmaking-mode';
import { MatchApi } from '../../generated-api/gameserver';
import { GAMESERVER_APIURL } from '../../utils/env';
import { MatchDto, MatchPageDto } from './dto/match.dto';
import { MatchMapper } from './match.mapper';
import { LiveMatchService } from '../../cache/live-match.service';

@Controller('match')
@ApiTags('match')
export class MatchController {
  private ms: MatchApi;

  constructor(
    private readonly mapper: MatchMapper,
  ) {
    this.ms = new MatchApi(undefined, `http://${GAMESERVER_APIURL}`);
  }

  @UseInterceptors(CacheInterceptor)
  @ApiQuery({
    name: 'page',
    required: true,
  })
  @ApiQuery({
    name: 'per_page',
    required: false,
  })
  @ApiQuery({
    name: 'mode',
    required: false,
  })
  @Get('/all')
  async matches(
    @Query('page') page: number,
    @Query('per_page') perPage: number = 25,
    @Query('mode') mode?: MatchmakingMode,
  ): Promise<MatchPageDto> {
    return this.ms
      .matchControllerMatches(page, perPage, mode)
      .then(t => this.mapper.mapMatchPage(t.data));
  }



  @UseInterceptors(CacheInterceptor)
  @ApiParam({
    name: 'id',
    required: true,
  })
  @Get('/:id')
  async match(@Param('id') id: number): Promise<MatchDto> {
    return this.mapper.mapMatch(
      await this.ms.matchControllerGetMatch(id).then(t => t.data),
    );
  }


  @UseInterceptors(CacheInterceptor)
  @ApiParam({
    name: 'id',
    required: true,
  })
  @ApiQuery({
    name: 'page',
    required: true,
  })
  @ApiQuery({
    name: 'per_page',
    required: false,
  })
  @ApiQuery({
    name: 'mode',
    required: false,
  })
  @ApiQuery({
    name: 'hero',
    type: String,
    required: false,
  })
  @Get('/player/:id')
  async playerMatches(
    @Param('id') steam_id: string,
    @Query('page') page: number,
    @Query('per_page') perPage: number = 25,
    @Query('mode') mode?: MatchmakingMode,
    @Query('hero') hero?: string,
  ): Promise<MatchPageDto> {
    return this.ms
      .matchControllerPlayerMatches(steam_id, page, perPage, mode, hero)
      .then(t => this.mapper.mapMatchPage(t.data));
  }
}
