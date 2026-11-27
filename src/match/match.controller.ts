import {
  Body,
  ForbiddenException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  Query,
} from "@nestjs/common";
import { CacheTTL } from "@nestjs/cache-manager";
import { ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { MatchmakingMode } from "../gateway/shared-types/matchmaking-mode";
import {
  MatchDto,
  MatchPageDto,
  MatchReportInfoDto,
  ReportPlayerDto,
} from "./dto/match.dto";
import { asMatchmakingMode } from "../types/gs-api-compat";
import { MatchMapper } from "./match.mapper";
import { WithOptionalUser } from "../utils/decorator/with-optional-user";
import {
  CurrentUser,
  CurrentUserDto,
} from "../utils/decorator/current-user";
import { WithPagination } from "../utils/decorator/pagination";
import { WithUser } from "../utils/decorator/with-user";
import { ApiClient } from "@dota2classic/gs-api-generated/dist/module";
import { PagePipe, PerPagePipe } from "../utils/pipes";

@Controller("match")
@ApiTags("match")
export class MatchController {
  constructor(
    private readonly mapper: MatchMapper,
    private readonly gsApi: ApiClient,
  ) {}

  @CacheTTL(10)
  @WithPagination()
  @ApiQuery({
    name: "mode",
    type: "number",
    required: false,
  })
  @Get("/all")
  async matches(
    @Query("page", PagePipe) page: number,
    @Query("per_page", new PerPagePipe()) perPage: number,
    @Query("mode") mode?: MatchmakingMode,
  ): Promise<MatchPageDto> {
    const res = await this.gsApi.match.matchControllerMatches({
      page,
      per_page: perPage,
      mode,
    });
    return this.mapper.mapMatchPage(res.data);
  }

  @CacheTTL(10)
  @WithPagination()
  @ApiQuery({
    name: "hero",
    required: true,
  })
  @Get("/by_hero")
  async heroMatches(
    @Query("page", PagePipe) page: number,
    @Query("per_page", new PerPagePipe()) perPage: number,
    @Query("hero") hero: string,
  ): Promise<MatchPageDto> {
    const res = await this.gsApi.match.matchControllerHeroMatches({
      page,
      per_page: perPage,
      hero,
    });
    return this.mapper.mapMatchPage(res.data);
  }

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
      const res = await this.gsApi.match.matchControllerGetMatch(id);
      return this.mapper.mapMatch(res.data, user?.steam_id);
    } catch (e) {
      throw new NotFoundException();
    }
  }

  @ApiParam({
    name: "id",
    required: true,
  })
  @Get("/:id/reportMatrix")
  @WithOptionalUser()
  async matchReportMatrix(
    @CurrentUser() user: CurrentUserDto | undefined,
    @Param("id") id: number,
  ): Promise<MatchReportInfoDto> {
    return this.getReportMatrix(user, id);
  }

  @CacheTTL(10)
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
    @Query("page", PagePipe) page: number,
    @Query("per_page", new PerPagePipe()) perPage: number,
    @Query("mode") mode?: MatchmakingMode,
    @Query("hero") hero?: string,
  ): Promise<MatchPageDto> {
    const res = await this.gsApi.match.matchControllerPlayerMatches(steam_id, {
      page,
      per_page: perPage,
      mode,
      hero,
    });
    return this.mapper.mapMatchPage(res.data);
  }

  @WithUser()
  @Put("/report")
  public async reportPlayerInMatch(
    @CurrentUser() user: CurrentUserDto,
    @Body() dto: ReportPlayerDto,
  ) {
    const match = await this.gsApi.match.matchControllerGetMatch(dto.matchId);
    if (asMatchmakingMode(match.data.mode) === MatchmakingMode.SECRET) {
      throw new ForbiddenException("Reports are disabled for SECRET matches");
    }
    await this.gsApi.player.playerModerationControllerReportPlayer({
      reporterSteamId: user.steam_id,
      reportedSteamId: dto.steamId,
      aspect: dto.aspect,
      matchId: dto.matchId,
    });
    return this.getReportMatrix(user, dto.matchId);
  }

  private async getReportMatrix(
    user: CurrentUserDto | undefined,
    id: number,
  ): Promise<MatchReportInfoDto> {
    try {
      if (user) {
        const res = await this.gsApi.match.matchControllerGetMatchReportMatrix(
          id,
          { steamId: user.steam_id || "" },
        );
        return this.mapper.mapReportMatrixDto(res.data, user.steam_id);
      } else {
        return { reportableSteamIds: [] };
      }
    } catch (e) {
      throw new NotFoundException();
    }
  }
}
