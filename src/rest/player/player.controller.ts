import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Dota2Version } from '../../gateway/shared-types/dota2version';
import { PlayerApi } from '../../generated-api/gameserver';
import { GAMESERVER_APIURL } from '../../utils/env';
import { PlayerMapper } from './player.mapper';
import { LeaderboardEntryDto, PlayerSummaryDto } from './dto/player.dto';
import { CurrentUser } from '../../utils/decorator/current-user';
import { AuthGuard } from '@nestjs/passport';

@Controller('player')
@ApiTags('player')
export class PlayerController {
  private ms: PlayerApi;

  constructor(private readonly mapper: PlayerMapper) {
    this.ms = new PlayerApi(undefined, `http://${GAMESERVER_APIURL}`);
  }

  @Get('/me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async me(@CurrentUser() user): Promise<PlayerSummaryDto> {
    const rawData = await this.ms.playerControllerPlayerSummary(
      Dota2Version.Dota_681,
      user.steam_id,
    );
    return this.mapper.mapPlayerSummary(rawData.data);
  }

  @ApiQuery({ required: false, name: 'version' })
  @Get('/leaderboard')
  async leaderboard(
    @Query('version') version: Dota2Version = Dota2Version.Dota_681,
  ): Promise<LeaderboardEntryDto[]> {
    const rawData = await this.ms.playerControllerLeaderboard(version);
    return Promise.all(rawData.data.map(this.mapper.mapLeaderboardEntry));
  }

  @Get('/summary/:id')
  async playerSummary(
    @Param('id') steam_id: string,
  ): Promise<PlayerSummaryDto> {
    const rawData = await this.ms.playerControllerPlayerSummary(
      Dota2Version.Dota_681,
      steam_id,
    );
    return this.mapper.mapPlayerSummary(rawData.data);
  }
}
