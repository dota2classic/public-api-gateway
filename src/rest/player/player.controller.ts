import {
  Body,
  CacheTTL,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Dota2Version } from '../../gateway/shared-types/dota2version';
import { PlayerApi } from '../../generated-api/gameserver';
import { GAMESERVER_APIURL } from '../../utils/env';
import { PlayerMapper } from './player.mapper';
import { LeaderboardEntryDto, MeDto, MyProfileDto, PlayerPreviewDto, PlayerSummaryDto } from './dto/player.dto';
import { CurrentUser, CurrentUserDto } from '../../utils/decorator/current-user';
import { AuthGuard } from '@nestjs/passport';
import { EventBus, QueryBus } from '@nestjs/cqrs';
import { GetPartyQuery } from '../../gateway/queries/GetParty/get-party.query';
import { GetPartyQueryResult } from '../../gateway/queries/GetParty/get-party-query.result';
import { D2CUser } from '../strategy/jwt.strategy';
import { PlayerId } from '../../gateway/shared-types/player-id';
import { UserRepository } from '../../cache/user/user.repository';
import { WithUser } from '../../utils/decorator/with-user';
import { UserConnectionRepository } from '../../cache/user-connection/user-connection.repository';
import { Client } from 'discord.js';
import { UserConnection } from '../../gateway/shared-types/user-connection';
import { UserMightExistEvent } from '../../gateway/events/user/user-might-exist.event';
import { ClientProxy } from '@nestjs/microservices';
import { HeroStatsDto, PlayerGeneralStatsDto } from './dto/hero.dto';
import { HttpCacheInterceptor } from '../../utils/cache-key-track';
import { ReportDto } from './dto/report.dto';
import { GetReportsAvailableQuery } from '../../gateway/queries/GetReportsAvailable/get-reports-available.query';
import { GetReportsAvailableQueryResult } from '../../gateway/queries/GetReportsAvailable/get-reports-available-query.result';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { backUrl } from '../../utils/utils';


@Controller('player')
@ApiTags('player')
export class PlayerController {
  private ms: PlayerApi;

  constructor(
    private readonly mapper: PlayerMapper,
    private readonly qbus: QueryBus,
    private readonly userRepository: UserRepository,
    private readonly userConnectionRep: UserConnectionRepository,
    @Inject('DiscordClient') private readonly client: Client,
    @Inject('QueryCore') private readonly redisEventQueue: ClientProxy,

    private readonly ebus: EventBus,
  ) {
    this.ms = new PlayerApi(undefined, `http://${GAMESERVER_APIURL}`);
  }


  @Post('upload')
  @WithUser()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './dist/upload',
        filename: (req, file, cb) => {
          // Generating a 32 random chars long string
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          //Calling the callback passing the random name generated with the original extension name
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  public async uploadImage(@UploadedFile() file) {

    // console.log(`upload hehe`, file)
    //.split('.').slice(0, -1).join('.');
    // img.path = file.filename;
    // await rep.save(img);
    return  file.filename;
  }


  @Get('/me')
  @WithUser()
  @CacheTTL(60)
  async me(@CurrentUser() user: CurrentUserDto): Promise<MeDto> {
    const rawData = await this.ms.playerControllerPlayerSummary(
      Dota2Version.Dota_681,
      user.steam_id,
    );

    const res = await this.ms.playerControllerBanInfo(user.steam_id);

    const pid = new PlayerId(user.steam_id);
    const u =
      pid &&
      (await this.qbus.execute<
        GetReportsAvailableQuery,
        GetReportsAvailableQueryResult
      >(new GetReportsAvailableQuery(pid)));

    return this.mapper.mapMe(rawData.data, res.data, u);
  }

  @Get('/connections')
  @WithUser()
  async connections(
    @CurrentUser() user: CurrentUserDto,
  ): Promise<MyProfileDto> {
    const connections = await this.userConnectionRep.resolve(user.steam_id);

    if (!connections) return {};

    const externalUser = this.client.users.resolve(connections.externalId);

    if (!externalUser)
      return {
        error: true,
      };

    return {
      discord: {
        connection: UserConnection.DISCORD,
        avatar: externalUser.avatarURL(),
        name: externalUser.username,
        id: externalUser.id,
      },
    };
  }

  @UseInterceptors(HttpCacheInterceptor)
  @ApiQuery({ required: false, name: 'version' })
  @Get('/leaderboard')
  // every half and hour
  @CacheTTL(60 * 30)
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

    this.redisEventQueue.emit(
      UserMightExistEvent.name,
      new UserMightExistEvent(new PlayerId(steam_id)),
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

  @UseInterceptors(HttpCacheInterceptor)
  @Get('/summary/hero/:id')
  async heroSummary(@Param('id') steam_id: string): Promise<HeroStatsDto[]> {
    const d = await this.ms.playerControllerPlayerHeroSummary(
      Dota2Version.Dota_681,
      steam_id,
    );
    return d.data;
  }

  @UseInterceptors(HttpCacheInterceptor)
  @Get('/summary/general/:id')
  async generalSummary(
    @Param('id') steam_id: string,
  ): Promise<PlayerGeneralStatsDto> {
    const d = await this.ms.playerControllerPlayerGeneralSummary(
      Dota2Version.Dota_681,
      steam_id,
    );
    return d.data;
  }

  @Get('/search')
  async search(
    @Query('name') name: string,
    @CurrentUser() user: D2CUser,
  ): Promise<PlayerPreviewDto[]> {
    //TODO!!! WE NEED TO MAKE THIS GOOD NOT BAD :wicked:
    return (await this.userRepository.all())
      .filter(t => t.name.toLowerCase().includes(name.toLowerCase()))
      .slice(0, 100);
  }

  @Post('/report')
  @WithUser()
  async reportPlayer(
    @CurrentUser() user: CurrentUserDto,
    @Body() dto: ReportDto,
  ): Promise<boolean> {
    try {
      await this.ms.playerControllerReportPlayer({
        reported: new PlayerId(dto.reported),
        reporter: new PlayerId(user.steam_id),
        matchId: dto.matchId,
        text: dto.text.substr(0, 500),
      });
      return true;
    } catch (e) {
      return false;
    } finally {
      console.log('hehehehe', dto.matchId);
    }
  }
}
