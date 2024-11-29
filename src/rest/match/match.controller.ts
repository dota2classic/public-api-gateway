import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { CacheTTL } from "@nestjs/cache-manager";
import { ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { MatchmakingMode } from "../../gateway/shared-types/matchmaking-mode";
import { MatchApi } from "../../generated-api/gameserver";
import { MatchDto, MatchPageDto } from "./dto/match.dto";
import { MatchMapper } from "./match.mapper";
import { WithOptionalUser } from "../../utils/decorator/with-optional-user";
import {
  CurrentUser,
  CurrentUserDto,
} from "../../utils/decorator/current-user";
import { PlayerId } from "../../gateway/shared-types/player-id";
import { HttpCacheInterceptor } from "../../utils/cache-key-track";
import { QueryBus } from "@nestjs/cqrs";
import { GetReportsAvailableQuery } from "../../gateway/queries/GetReportsAvailable/get-reports-available.query";
import { GetReportsAvailableQueryResult } from "../../gateway/queries/GetReportsAvailable/get-reports-available-query.result";
import { WithPagination } from "../../utils/decorator/pagination";

@Controller("match")
@ApiTags("match")
export class MatchController {
  constructor(
    private readonly mapper: MatchMapper,
    private readonly qbus: QueryBus,
    private readonly ms: MatchApi,
  ) {}

  @UseInterceptors(HttpCacheInterceptor)
  @WithPagination()
  @ApiQuery({
    name: "mode",
    type: "number",
    required: false,
  })
  @Get("/all")
  async matches(
    @Query("page") page: number,
    @Query("per_page") perPage: number = 25,
    @Query("mode") mode?: MatchmakingMode,
  ): Promise<MatchPageDto> {
    return this.ms
      .matchControllerMatches(page, perPage, mode)
      .then(this.mapper.mapMatchPage);
  }

  @UseInterceptors(HttpCacheInterceptor)
  @WithPagination()
  @ApiQuery({
    name: "hero",
    required: true,
  })
  @Get("/by_hero")
  async heroMatches(
    @Query("page") page: number,
    @Query("per_page") perPage: number = 25,
    @Query("hero") hero: string,
  ): Promise<MatchPageDto> {
    return this.ms
      .matchControllerHeroMatches(page, hero, perPage)
      .then(this.mapper.mapMatchPage);
  }

  @UseInterceptors(HttpCacheInterceptor)
  @CacheTTL(10)
  @ApiParam({
    name: "id",
    required: true,
  })
  @Get("/:id")
  @WithOptionalUser()
  async match(
    @CurrentUser() user: CurrentUserDto | undefined,
    @Param("id") id: number,
  ): Promise<MatchDto> {
    try {
      const pid = (user && new PlayerId(user.steam_id)) || undefined;

      const u =
        pid &&
        (await this.qbus.execute<
          GetReportsAvailableQuery,
          GetReportsAvailableQueryResult
        >(new GetReportsAvailableQuery(pid)));

      return this.mapper.mapMatch(await this.ms.matchControllerGetMatch(id), u);
    } catch (e) {
      throw new NotFoundException();
    }
  }

  @UseInterceptors(HttpCacheInterceptor)
  @ApiParam({
    name: "id",
    required: true,
  })
  @WithPagination()
  @ApiQuery({
    name: "mode",
    required: false,
  })
  @ApiQuery({
    name: "hero",
    type: String,
    required: false,
  })
  @Get("/player/:id")
  async playerMatches(
    @Param("id") steam_id: string,
    @Query("page") page: number,
    @Query("per_page") perPage: number = 25,
    @Query("mode") mode?: MatchmakingMode,
    @Query("hero") hero?: string,
  ): Promise<MatchPageDto> {
    return this.ms
      .matchControllerPlayerMatches(steam_id, page, perPage, mode, hero)
      .then((t) => this.mapper.mapMatchPage(t));
  }
}
