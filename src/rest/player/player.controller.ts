import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { CacheTTL } from "@nestjs/cache-manager";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { PlayerApi } from "../../generated-api/gameserver";
import { PlayerMapper } from "./player.mapper";
import {
  DodgeListEntryDto,
  DodgePlayerDto,
  LeaderboardEntryPageDto,
  MeDto,
  MyProfileDto,
  PlayerSummaryDto,
  PlayerTeammatePageDto,
} from "./dto/player.dto";
import {
  CurrentUser,
  CurrentUserDto,
} from "../../utils/decorator/current-user";
import { AuthGuard } from "@nestjs/passport";
import { QueryBus } from "@nestjs/cqrs";
import { D2CUser } from "../strategy/jwt.strategy";
import { PlayerId } from "../../gateway/shared-types/player-id";
import { OldGuard, WithUser } from "../../utils/decorator/with-user";
import { UserMightExistEvent } from "../../gateway/events/user/user-might-exist.event";
import { ClientProxy } from "@nestjs/microservices";
import { HeroStatsDto } from "./dto/hero.dto";
import { UserHttpCacheInterceptor } from "../../utils/cache-key-track";
import { UserDTO } from "../shared.dto";
import { AchievementDto } from "./dto/achievement.dto";
import { WithPagination } from "../../utils/decorator/pagination";
import { NullableIntPipe } from "../../utils/pipes";
import { PartyService } from "../party.service";
import { ReqLoggingInterceptor } from "../../middleware/req-logging.interceptor";
import { SocketDelivery } from "../../socket/socket-delivery";
import { UserProfileService } from "../../service/user-profile.service";
import { FindByNameQuery } from "../../gateway/queries/FindByName/find-by-name.query";
import { FindByNameQueryResult } from "../../gateway/queries/FindByName/find-by-name-query.result";
import { GetReportsAvailableQuery } from "../../gateway/queries/GetReportsAvailable/get-reports-available.query";
import { GetReportsAvailableQueryResult } from "../../gateway/queries/GetReportsAvailable/get-reports-available-query.result";
import { UserRelationService } from "../../service/user-relation.service";
import { UserRelationStatus } from "../../gateway/shared-types/user-relation";

@UseInterceptors(ReqLoggingInterceptor)
@Controller("player")
@ApiTags("player")
export class PlayerController {
  constructor(
    private readonly mapper: PlayerMapper,
    private readonly qbus: QueryBus,
    @Inject("QueryCore") private readonly redisEventQueue: ClientProxy,
    private readonly partyService: PartyService,
    private readonly ms: PlayerApi,
    private readonly socketDelivery: SocketDelivery,
    private readonly userProfile: UserProfileService,
    private readonly relation: UserRelationService,
  ) {}

  @Get("/me")
  @WithUser()
  @CacheTTL(60)
  async me(@CurrentUser() user: CurrentUserDto): Promise<MeDto> {
    const rawData = await this.ms.playerControllerPlayerSummary(user.steam_id);

    const res = await this.ms.playerControllerBanInfo(user.steam_id);

    const u = await this.qbus.execute<
      GetReportsAvailableQuery,
      GetReportsAvailableQueryResult
    >(new GetReportsAvailableQuery(new PlayerId(user.steam_id)));

    return this.mapper.mapMe(rawData, res, undefined, u);
  }

  @Get("/connections")
  @WithUser()
  async connections(
    @CurrentUser() user: CurrentUserDto,
  ): Promise<MyProfileDto> {
    return {};
  }

  @UseInterceptors(UserHttpCacheInterceptor)
  @CacheTTL(60 * 5)
  @Get("/leaderboard")
  @WithPagination()
  @ApiQuery({
    name: "season_id",
    required: false,
  })
  async leaderboard(
    @Query("page") page: number,
    @Query("per_page", NullableIntPipe) perPage: number = 25,
    @Query("season_id", NullableIntPipe) seasonId?: number,
  ): Promise<LeaderboardEntryPageDto> {
    const rawPage = await this.ms.playerControllerLeaderboard(
      page,
      perPage,
      seasonId,
    );

    return {
      data: await Promise.all(
        rawPage.data.map(this.mapper.mapLeaderboardEntry),
      ),
      page: rawPage.page,
      perPage: rawPage.perPage,
      pages: rawPage.pages,
    };
  }

  @WithPagination()
  @Get("/:id/teammates")
  async teammates(
    @Param("id") steam_id: string,
    @Query("page") page: number,
    @Query("per_page") perPage: number = 25,
  ): Promise<PlayerTeammatePageDto> {
    const rawData = await this.ms.playerControllerPlayerTeammates(
      steam_id,
      page,
      perPage,
    );
    return {
      data: await Promise.all(rawData.data.map(this.mapper.mapTeammate)),
      page: rawData.page,
      perPage: rawData.perPage,
      pages: rawData.pages,
    };
  }

  @Get("/:id/achievements")
  async achievements(@Param("id") steam_id: string): Promise<AchievementDto[]> {
    const rawData = await this.ms.playerControllerPlayerAchievements(steam_id);

    return Promise.all(rawData.map(this.mapper.mapAchievement));
  }

  @Get("/:id/summary")
  async playerSummary(@Param("id") steamId: string): Promise<PlayerSummaryDto> {
    this.redisEventQueue.emit(
      UserMightExistEvent.name,
      new UserMightExistEvent(new PlayerId(steamId)),
    );

    const [raw, bans] = await Promise.combine([
      this.ms.playerControllerPlayerSummary(steamId),
      this.ms.playerControllerBanInfo(steamId),
    ]);

    return this.mapper.mapPlayerSummary(raw, bans);
  }

  @Get("/party")
  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  async myParty(@CurrentUser() user: D2CUser) {
    return this.partyService.getParty(user.steam_id);
  }

  @UseInterceptors(UserHttpCacheInterceptor)
  @Get("/summary/hero/:id")
  async heroSummary(@Param("id") steam_id: string): Promise<HeroStatsDto[]> {
    return this.ms.playerControllerPlayerHeroSummary(steam_id);
  }

  @WithUser()
  @Get("/dodge_list")
  async getDodgeList(
    @CurrentUser() user: CurrentUserDto,
  ): Promise<DodgeListEntryDto[]> {
    return this.ms
      .playerControllerGetDodgeList(user.steam_id)
      .then((list) => Promise.all(list.map(this.mapper.mapDodgeEntry)));
  }

  @OldGuard()
  @WithUser()
  @Post("/start_recalibration")
  async startRecalibration(
    @CurrentUser() user: CurrentUserDto,
  ): Promise<PlayerSummaryDto> {
    try {
      return await this.ms
        .playerControllerStartRecalibration({ steamId: user.steam_id })
        .then(() => this.playerSummary(user.steam_id));
    } catch (e) {
      throw new HttpException(
        { message: "Калибровку можно перезапускать 1 раз за сезон!" },
        400,
      );
    }
  }

  @OldGuard()
  @WithUser()
  @Post("/dodge_list")
  async dodgePlayer(
    @CurrentUser() user: CurrentUserDto,
    @Body() dto: DodgePlayerDto,
  ): Promise<DodgeListEntryDto[]> {
    return this.ms
      .playerControllerDodgePlayer({
        steamId: user.steam_id,
        toDodgeSteamId: dto.dodgeSteamId,
      })
      .then((list) => Promise.all(list.map(this.mapper.mapDodgeEntry)));
  }

  @OldGuard()
  @WithUser()
  @Delete("/dodge_list")
  async unDodgePlayer(
    @CurrentUser() user: CurrentUserDto,
    @Body() dto: DodgePlayerDto,
  ): Promise<DodgeListEntryDto[]> {
    return this.ms
      .playerControllerUnDodgePlayer({
        steamId: user.steam_id,
        toDodgeSteamId: dto.dodgeSteamId,
      })
      .then((list) => Promise.all(list.map(this.mapper.mapDodgeEntry)));
  }

  @Get("/search")
  async search(
    @Query("name") name: string,
    @Query("count", NullableIntPipe) count: number = 30,
    @CurrentUser() user: D2CUser,
  ): Promise<UserDTO[]> {
    const online = this.socketDelivery.getOnline();

    const result = await this.qbus.execute<
      FindByNameQuery,
      FindByNameQueryResult
    >(new FindByNameQuery(name, 50, online));
    return Promise.all(result.steamIds.map(this.userProfile.userDto));
  }

  @OldGuard()
  @WithUser()
  @Post("/block/:id")
  public async blockPlayer(
    @CurrentUser() user: CurrentUserDto,
    @Param("id") steamId: string,
  ) {
    await this.relation.setPlayerRelation(
      user.steam_id,
      steamId,
      UserRelationStatus.BLOCK,
    );
  }

  @OldGuard()
  @WithUser()
  @Delete("/block/:id")
  public async unblockPlayer(
    @CurrentUser() user: CurrentUserDto,
    @Param("id") steamId: string,
  ) {
    await this.relation.clearPlayerRelation(user.steam_id, steamId);
  }
}
