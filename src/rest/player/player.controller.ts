import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Dota2Version } from '../../gateway/shared-types/dota2version';
import { PlayerApi } from '../../generated-api/gameserver';
import { GAMESERVER_APIURL } from '../../utils/env';
import { PlayerMapper } from './player.mapper';
import { LeaderboardEntryDto, PlayerPreviewDto, PlayerSummaryDto } from './dto/player.dto';
import { CurrentUser } from '../../utils/decorator/current-user';
import { AuthGuard } from '@nestjs/passport';
import { QueryBus } from '@nestjs/cqrs';
import { GetPartyQuery } from '../../gateway/queries/GetParty/get-party.query';
import { GetPartyQueryResult } from '../../gateway/queries/GetParty/get-party-query.result';
import { D2CUser } from '../strategy/jwt.strategy';
import { PlayerId } from '../../gateway/shared-types/player-id';
import { UserRepository } from '../../cache/user/user.repository';
import { WithUser } from '../../utils/decorator/with-user';

@Controller('player')
@ApiTags('player')
export class PlayerController {
  private ms: PlayerApi;

  constructor(
    private readonly mapper: PlayerMapper,
    private readonly qbus: QueryBus,
    private readonly userRepository: UserRepository,
  ) {
    this.ms = new PlayerApi(undefined, `http://${GAMESERVER_APIURL}`);
  }

  @Get('/me')
  @WithUser()
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

  @Get('/party')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async myParty(@CurrentUser() user: D2CUser) {
    const party = await this.qbus.execute<GetPartyQuery, GetPartyQueryResult>(
      new GetPartyQuery(new PlayerId(user.steam_id)),
    );
    return this.mapper.mapParty(party);
  }

  @Get('/search')
  async search(
    @Query('name') name: string,
    @CurrentUser() user: D2CUser,
  ): Promise<PlayerPreviewDto[]> {
    return (await this.userRepository.all())
      .filter(t => t.name.toLowerCase().includes(name.toLowerCase()))
      .slice(0, 100);
  }
}
