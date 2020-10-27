import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MatchmakingMode } from '../gateway/shared-types/matchmaking-mode';
import { MatchApi, MatchDto, MatchPageDto } from '../generated-api/gameserver';
import { GAMESERVER_APIURL } from '../env';

@Controller()
@ApiTags('match')
export class MatchController {
  private ms: MatchApi;

  constructor() {
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
    return this.ms.restControllerMatches(page, perPage, mode).then(t => t.data);
  }

  @ApiParam({
    name: 'id',
    required: true,
  })
  @Get('/:id')
  async match(@Param('id') id: number): Promise<MatchDto> {
    return this.ms.restControllerGetMatch(id).then(t => t.data);
  }
}
