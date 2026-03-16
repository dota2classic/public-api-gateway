import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { CacheTTL } from "@nestjs/cache-manager";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ApiClient } from "@dota2classic/gs-api-generated/dist/module";
import { PlayerMapper } from "./player.mapper";
import {
  DodgeListEntryDto,
  DodgePlayerDto,
  LeaderboardEntryPageDto,
  MeDto,
  MyProfileDto,
  PlayerRelationDto,
  PlayerSummaryDto,
  PlayerTeammatePageDto,
} from "./dto/player.dto";
import {
  CurrentUser,
  CurrentUserDto,
} from "../utils/decorator/current-user";
import { AuthGuard } from "@nestjs/passport";
import { QueryBus } from "@nestjs/cqrs";
import { D2CUser } from "../strategy/jwt.strategy";
import { OldGuard, WithOptionalUser, WithUser } from "../utils/decorator/with-user";
import { HeroStatsDto } from "./dto/hero.dto";
import { UserHttpCacheInterceptor } from "../utils/cache-key-track";
import { UserDTO } from "../shared.dto";
import { AchievementDto } from "./dto/achievement.dto";
import { WithPagination } from "../utils/decorator/pagination";
import { NullableIntPipe, PagePipe, PerPagePipe } from "../utils/pipes";
import { PartyService } from "../party.service";
import { UserProfileService } from "../service/user-profile.service";
import { UserRelationService } from "../service/user-relation.service";
import { UserRelationStatus } from "../gateway/shared-types/user-relation";
import { GlobalHttpCacheInterceptor } from "../utils/cache-global";
import { ReqLoggingInterceptor } from "../metrics/req-logging.interceptor";
import { PlayerService } from "./player.service";

@UseInterceptors(ReqLoggingInterceptor)
@Controller("player")
@ApiTags("player")
export class PlayerController {
  constructor(
    private readonly mapper: PlayerMapper,
    private readonly qbus: QueryBus,
    private readonly partyService: PartyService,
    private readonly gsApi: ApiClient,
    private readonly userProfile: UserProfileService,
    private readonly relation: UserRelationService,
    private readonly playerService: PlayerService,
  ) {}

  // @UseInterceptors(UserHttpCacheInterceptor)
  @Get("/me")
  @WithUser()
  // @CacheTTL(5)
  async me(@CurrentUser() user: CurrentUserDto): Promise<MeDto> {
    const [summary, banStatus, reportsAvailable] = await Promise.combine([
      this.gsApi.player.playerControllerPlayerSummary(user.steam_id),
      this.gsApi.player.playerControllerBanInfo(user.steam_id),
      this.gsApi.player.playerControllerReportsAvailable(user.steam_id),
    ]);
    return this.mapper.mapMe(summary.data, banStatus.data, reportsAvailable.data);
  }

  @Get("/connections")
  @WithUser()
  async connections(
    @CurrentUser() user: CurrentUserDto,
  ): Promise<MyProfileDto> {
    return {};
  }

  @UseInterceptors(GlobalHttpCacheInterceptor)
  @CacheTTL(60 * 2)
  @Get("/leaderboard")
  @WithPagination()
  @ApiQuery({
    name: "season_id",
    required: false,
  })
  async leaderboard(
    @Query("page", PagePipe) page: number,
    @Query("per_page", new PerPagePipe()) perPage: number,
    @Query("season_id", NullableIntPipe) seasonId?: number,
  ): Promise<LeaderboardEntryPageDto> {
    const res = await this.gsApi.player.playerControllerLeaderboard({
      page,
      per_page: perPage,
      season_id: seasonId,
    });
    const rawPage = res.data;

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
    @Query("page", PagePipe) page: number,
    @Query("per_page", new PerPagePipe()) perPage: number,
  ): Promise<PlayerTeammatePageDto> {
    const res = await this.gsApi.player.playerControllerPlayerTeammates(
      steam_id,
      { page, per_page: perPage },
    );
    const rawData = res.data;
    return {
      data: await Promise.all(rawData.data.map(this.mapper.mapTeammate)),
      page: rawData.page,
      perPage: rawData.perPage,
      pages: rawData.pages,
    };
  }

  @Get("/:id/user")
  async user(@Param("id") steam_id: string): Promise<UserDTO> {
    return this.userProfile.userDto(steam_id);
  }

  @Get("/:id/achievements")
  async achievements(@Param("id") steam_id: string): Promise<AchievementDto[]> {
    const res = await this.gsApi.player.playerControllerPlayerAchievements(steam_id);

    return Promise.all(res.data.map(this.mapper.mapAchievement));
  }

  @CacheTTL(5)
  @Get("/:id/summary")
  async playerSummary(@Param("id") steamId: string): Promise<PlayerSummaryDto> {
    this.playerService.notifyMightExist(steamId);

    const [raw, bans] = await Promise.combine([
      this.gsApi.player.playerControllerPlayerSummary(steamId),
      this.gsApi.player.playerControllerBanInfo(steamId),
    ]);

    return this.mapper.mapPlayerSummary(raw.data, bans.data);
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
    const res = await this.gsApi.player.playerControllerPlayerHeroSummary(steam_id);
    return res.data;
  }

  @WithUser()
  @Get("/dodge_list")
  async getDodgeList(
    @CurrentUser() user: CurrentUserDto,
  ): Promise<DodgeListEntryDto[]> {
    const res = await this.gsApi.player.playerControllerGetDodgeList({
      steamId: user.steam_id,
    });
    return Promise.all(res.data.map(this.mapper.mapDodgeEntry));
  }

  @OldGuard()
  @WithUser()
  @Post("/start_recalibration")
  async startRecalibration(
    @CurrentUser() user: CurrentUserDto,
  ): Promise<PlayerSummaryDto> {
    try {
      await this.gsApi.player.playerControllerStartRecalibration({
        steamId: user.steam_id,
      });
      return this.playerSummary(user.steam_id);
    } catch (e) {
      throw new HttpException(
        { message: "Калибровку можно перезапускать 1 раз за сезон!" },
        400,
      );
    }
  }

  @WithUser()
  @Post("/abandon_game")
  public async abandonGame(@CurrentUser() user: CurrentUserDto) {
    await this.gsApi.player.playerControllerAbandonSession({
      steamId: user.steam_id,
    });
  }

  @OldGuard()
  @WithUser()
  @Post("/dodge_list")
  async dodgePlayer(
    @CurrentUser() user: CurrentUserDto,
    @Body() dto: DodgePlayerDto,
  ): Promise<DodgeListEntryDto[]> {
    const res = await this.gsApi.player.playerControllerDodgePlayer({
      steamId: user.steam_id,
      toDodgeSteamId: dto.dodgeSteamId,
    });
    return Promise.all(res.data.map(this.mapper.mapDodgeEntry));
  }

  @OldGuard()
  @WithUser()
  @Delete("/dodge_list")
  async unDodgePlayer(
    @CurrentUser() user: CurrentUserDto,
    @Body() dto: DodgePlayerDto,
  ): Promise<DodgeListEntryDto[]> {
    const res = await this.gsApi.player.playerControllerUnDodgePlayer({
      steamId: user.steam_id,
      toDodgeSteamId: dto.dodgeSteamId,
    });
    return Promise.all(res.data.map(this.mapper.mapDodgeEntry));
  }

  @WithOptionalUser()
  @Get("/search")
  async search(
    @CurrentUser() user: CurrentUserDto | undefined,
    @Query("name") name: string,
    @Query("count", NullableIntPipe) count: number = 30,
  ): Promise<UserDTO[]> {
    const friends = user ? this.relation.getFriends(user.steam_id) : [];
    if (!name) {
      return Promise.all(
        friends.slice(0, count).map((id) => this.userProfile.userDto(id)),
      );
    }
    const steamIds = await this.playerService.search(name, count, friends);
    return Promise.all(steamIds.map((id) => this.userProfile.userDto(id)));
  }

  @WithUser()
  @Get("/friends")
  public async getFriends(@CurrentUser() user: CurrentUserDto): Promise<UserDTO[]> {
    const friends = this.relation.getFriends(user.steam_id);
    return Promise.all(friends.map((id) => this.userProfile.userDto(id)));
  }

  @WithUser()
  @Get("/:id/relation")
  public async getRelation(
    @CurrentUser() user: CurrentUserDto,
    @Param("id") steamId: string,
  ): Promise<PlayerRelationDto> {
    const [relationStatus, dodgeList] = await Promise.combine([
      this.relation.getRelation(user.steam_id, steamId),
      this.gsApi.player.playerControllerGetDodgeList({ steamId: user.steam_id }),
    ]);
    return {
      isFriend: relationStatus === UserRelationStatus.FRIEND,
      isBlocked: relationStatus === UserRelationStatus.BLOCK,
      isDodged: dodgeList.data.some((d) => d.steamId === steamId),
    };
  }

  @WithUser()
  @Post("/friend/:id")
  public async addFriend(
    @CurrentUser() user: CurrentUserDto,
    @Param("id") steamId: string,
  ) {
    await this.relation.setPlayerRelation(
      user.steam_id,
      steamId,
      UserRelationStatus.FRIEND,
    );
  }

  @WithUser()
  @Delete("/friend/:id")
  public async removeFriend(
    @CurrentUser() user: CurrentUserDto,
    @Param("id") steamId: string,
  ) {
    await this.relation.clearPlayerRelation(user.steam_id, steamId);
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
