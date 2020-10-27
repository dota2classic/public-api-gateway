import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MatchmakingMode } from '../../gateway/shared-types/matchmaking-mode';
import { MatchApi } from '../../generated-api/gameserver';
import { GAMESERVER_APIURL } from '../../utils/env';
import { MatchDto, MatchPageDto } from './dto/match.dto';
import { MatchMapper } from './match.mapper';

@Controller('match')
@ApiTags('match')
export class MatchController {
  private ms: MatchApi;

  constructor(private readonly mapper: MatchMapper) {
    this.ms = new MatchApi(undefined, `http://${GAMESERVER_APIURL}`);
  }

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
      .restControllerMatches(page, perPage, mode)
      .then(t => this.mapper.mapMatchPage(t.data));
  }

  @ApiParam({
    name: 'id',
    required: true,
  })
  @Get('/:id')
  async match(@Param('id') id: number): Promise<MatchDto> {
    return this.mapper.mapMatch(
      await this.ms.restControllerGetMatch(id).then(t => t.data),
    );
  }
}
