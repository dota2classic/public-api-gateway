import {
  Controller,
  Get,
  Inject,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { CacheTTL } from "@nestjs/cache-manager";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { PlayerApi } from "../../generated-api/gameserver";
import { PlayerMapper } from "./player.mapper";
import {
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
import { UserRepository } from "../../cache/user/user.repository";
import { WithUser } from "../../utils/decorator/with-user";
import { UserMightExistEvent } from "../../gateway/events/user/user-might-exist.event";
import { ClientProxy } from "@nestjs/microservices";
import { HeroStatsDto } from "./dto/hero.dto";
import { HttpCacheInterceptor } from "../../utils/cache-key-track";
import { GetReportsAvailableQuery } from "../../gateway/queries/GetReportsAvailable/get-reports-available.query";
import { GetReportsAvailableQueryResult } from "../../gateway/queries/GetReportsAvailable/get-reports-available-query.result";
import { UserDTO } from "../shared.dto";
import { AchievementDto } from "./dto/achievement.dto";
import { WithPagination } from "../../utils/decorator/pagination";
import { NullableIntPipe } from "../../utils/pipes";
import { PartyService } from "../party.service";
import { ReqLoggingInterceptor } from "../../middleware/req-logging.interceptor";
import { UserModel } from "../../cache/user/user.model";
import { SocketDelivery } from "../../socket/socket-delivery";

@UseInterceptors(ReqLoggingInterceptor)
@Controller("player")
@ApiTags("player")
export class PlayerController {
  constructor(
    private readonly mapper: PlayerMapper,
    private readonly qbus: QueryBus,
    private readonly userRepository: UserRepository,
    @Inject("QueryCore") private readonly redisEventQueue: ClientProxy,
    private readonly partyService: PartyService,
    private readonly ms: PlayerApi,
    private readonly socketDelivery: SocketDelivery,
  ) {}

  // @Post("upload")
  // @WithUser()
  // @UseInterceptors(
  //   FileInterceptor("image", {
  //     storage: diskStorage({
  //       destination: "./dist/upload",
  //       filename: (req, file, cb) => {
  //         // Generating a 32 random chars long string
  //         const randomName = Array(32)
  //           .fill(null)
  //           .map(() => Math.round(Math.random() * 16).toString(16))
  //           .join("");
  //         //Calling the callback passing the random name generated with the original extension name
  //         cb(null, `${randomName}${extname(file.originalname)}`);
  //       },
  //     }),
  //   }),
  // )
  // public async uploadImage(@UploadedFile() file) {
  //   // console.log(`upload hehe`, file)
  //   //.split('.').slice(0, -1).join('.');
  //   // img.path = file.filename;
  //   // await rep.save(img);
  //   return file.filename;
  // }

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

  @UseInterceptors(HttpCacheInterceptor)
  @CacheTTL(60 * 30)
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
  async playerSummary(
    @Param("id") steam_id: string,
  ): Promise<PlayerSummaryDto> {
    const rawData = await this.ms.playerControllerPlayerSummary(steam_id);

    this.redisEventQueue.emit(
      UserMightExistEvent.name,
      new UserMightExistEvent(new PlayerId(steam_id)),
    );
    return this.mapper.mapPlayerSummary(rawData);
  }

  @Get("/party")
  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  async myParty(@CurrentUser() user: D2CUser) {
    return this.partyService.getParty(user.steam_id);
  }

  @UseInterceptors(HttpCacheInterceptor)
  @Get("/summary/hero/:id")
  async heroSummary(@Param("id") steam_id: string): Promise<HeroStatsDto[]> {
    return this.ms.playerControllerPlayerHeroSummary(steam_id);
  }

  @Get("/search")
  async search(
    @Query("name") name: string,
    @Query("count", NullableIntPipe) count: number = 30,
    @CurrentUser() user: D2CUser,
  ): Promise<UserDTO[]> {
    const online = this.socketDelivery.getOnline();
    const isOnline = (steamId: string) => {
      return online.includes(steamId);
    };
    const score = (a: UserModel) => (isOnline(a.id) ? 10000 : 1);
    return (await this.userRepository.all())
      .filter((t) => t.name.toLowerCase().includes(name.toLowerCase()))
      .sort((a, b) => score(b) - score(a))
      .slice(0, count)
      .map((it) => ({
        steamId: it.id,
        name: it.name,
        avatar: it.avatar,
        roles: it.roles,
        avatarSmall: it.avatar && it.avatar.replace("_full", "_medium"),
      }));
  }
}
