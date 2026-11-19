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
import { UserDTO } from "../shared.dto";
import { AchievementDto } from "./dto/achievement.dto";
import { WithPagination } from "../utils/decorator/pagination";
import { NullableIntPipe, PagePipe, PerPagePipe } from "../utils/pipes";
import { PartyService } from "../party.service";
import { UserProfileService } from "../service/user-profile.service";
import { UserRelationService } from "../service/user-relation.service";
import { UserRelationStatus } from "../gateway/shared-types/user-relation";
import { CacheShared } from "../utils/http-cache";
import { PlayerService } from "./player.service";
import { PlayerSummaryService } from "../service/player-summary.service";

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
    private readonly playerSummaries: PlayerSummaryService,
  ) {}

  @Get("/me")
  @WithUser()
  async me(@CurrentUser() user: CurrentUserDto): Promise<MeDto> {
    const [{ summary, ban }, reportsAvailable] = await Promise.all([
      this.playerSummaries.get(user.steam_id),
      this.gsApi.player.playerModerationControllerReportsAvailable(user.steam_id),
    ]);
    return this.mapper.mapMe(summary, ban, reportsAvailable.data);
  }

  @Get("/connections")
  @WithUser()
  async connections(
    @CurrentUser() user: CurrentUserDto,
  ): Promise<MyProfileDto> {
    return {};
  }

  @CacheShared()
  @CacheTTL(60 * 2)
  @Get("/leaderboard")
  @WithPagination()
  @ApiQuery({
    name: "season_id",
    required: false,
  })
  @ApiQuery({
    name: "sort",
    required: false,
    enum: ["mmr", "games", "wins", "winrate", "kda", "playtime", "abandons"],
  })
  @ApiQuery({
    name: "sort_dir",
    required: false,
    enum: ["ASC", "DESC"],
  })
  async leaderboard(
    @Query("page", PagePipe) page: number,
    @Query("per_page", new PerPagePipe()) perPage: number,
    @Query("season_id", NullableIntPipe) seasonId?: number,
    @Query("sort") sort?: string,
    @Query("sort_dir") sortDir?: string,
  ): Promise<LeaderboardEntryPageDto> {
    // sort/sort_dir aren't in the published gs-api-generated types yet
    // (dota2classic/gameserver#12 not released) — gameserver's own runtime
    // just spreads the query object into the querystring, so this is
    // forwarded correctly today despite the type gap. Drop the cast once
    // the package picks up the new signature.
    const res = await this.gsApi.player.playerRankingControllerLeaderboard({
      page,
      per_page: perPage,
      season_id: seasonId,
      ...(sort ? { sort, sort_dir: sortDir } : {}),
    } as Parameters<typeof this.gsApi.player.playerRankingControllerLeaderboard>[0]);
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

  @CacheTTL(30)
  @CacheShared()
  @WithPagination()
  @Get("/:id/teammates")
  async teammates(
    @Param("id") steam_id: string,
    @Query("page", PagePipe) page: number,
    @Query("per_page", new PerPagePipe()) perPage: number,
  ): Promise<PlayerTeammatePageDto> {
    const res = await this.gsApi.player.playerProfileControllerPlayerTeammates(
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

  @CacheTTL(30)
  @CacheShared()
  @Get("/:id/achievements")
  async achievements(@Param("id") steam_id: string): Promise<AchievementDto[]> {
    const res = await this.gsApi.player.playerAchievementsControllerPlayerAchievements(steam_id);

    return this.mapper.mapAchievements(res.data);
  }

  @CacheTTL(5)
  @CacheShared()
  @Get("/:id/summary")
  async playerSummary(@Param("id") steamId: string): Promise<PlayerSummaryDto> {
    this.playerService.notifyMightExist(steamId);
    const { summary, ban } = await this.playerSummaries.get(steamId);
    return this.mapper.mapPlayerSummary(summary, ban);
  }

  @Get("/party")
  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  async myParty(@CurrentUser() user: D2CUser) {
    return this.partyService.getParty(user.steam_id);
  }

  @CacheTTL(10)
  @Get("/summary/hero/:id")
  async heroSummary(@Param("id") steam_id: string): Promise<HeroStatsDto[]> {
    const res = await this.gsApi.player.playerProfileControllerPlayerHeroSummary(steam_id);
    return res.data;
  }

  @WithUser()
  @Get("/dodge_list")
  async getDodgeList(
    @CurrentUser() user: CurrentUserDto,
  ): Promise<DodgeListEntryDto[]> {
    const res = await this.gsApi.player.playerSocialControllerGetDodgeList({
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
      await this.gsApi.player.playerRankingControllerStartRecalibration({
        steamId: user.steam_id,
      });
      this.playerSummaries.invalidate(user.steam_id);
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
    await this.gsApi.player.playerSessionControllerAbandonSession({
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
    const res = await this.gsApi.player.playerSocialControllerDodgePlayer({
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
    const res = await this.gsApi.player.playerSocialControllerUnDodgePlayer({
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
    const friends = user ? await this.relation.getFriends(user.steam_id) : [];
    if (!name) {
      return this.userProfile.userDtos(friends.slice(0, count));
    }
    const steamIds = await this.playerService.search(name, count, friends);
    return this.userProfile.userDtos(steamIds);
  }

  @WithUser()
  @Get("/friends")
  public async getFriends(@CurrentUser() user: CurrentUserDto): Promise<UserDTO[]> {
    const friends = await this.relation.getFriends(user.steam_id);
    return this.userProfile.userDtos(friends);
  }

  @WithUser()
  @Get("/:id/relation")
  public async getRelation(
    @CurrentUser() user: CurrentUserDto,
    @Param("id") steamId: string,
  ): Promise<PlayerRelationDto> {
    const [relationStatus, dodgeList] = await Promise.all([
      this.relation.getRelation(user.steam_id, steamId),
      this.gsApi.player.playerSocialControllerGetDodgeList({ steamId: user.steam_id }),
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
