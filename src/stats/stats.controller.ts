import { Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiClient } from "@dota2classic/gs-api-generated/dist/module";
import {
  AggregatedStatsDto,
  CurrentOnlineDto,
  GameSeasonDto,
  MaintenanceDto,
  MatchmakingInfo,
  QueueTimeDto,
  TwitchStreamDto,
} from "./stats.dto";
import { CacheTTL } from "@nestjs/cache-manager";
import { CacheShared } from "../utils/http-cache";
import { TwitchService } from "../twitch.service";
import { StatsMapper } from "./stats.mapper";
import { StatsService } from "./stats.service";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { MatchArtifactUploadedEvent } from "../gateway/events/match-artifact-uploaded.event";
import { MatchArtifactType } from "../gateway/shared-types/match-artifact-type";
import {
  asMatchmakingMode,
  asGameMode,
  asDotaMap,
  asDotaPatch,
} from "../types/gs-api-compat";

@Controller("stats")
@ApiTags("stats")
export class StatsController {
  constructor(
    private readonly gsApi: ApiClient,
    private readonly twitch: TwitchService,
    private readonly mapper: StatsMapper,
    private readonly statsService: StatsService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  @Post("/highlights/:id")
  public async requestHighlights(@Param("id") id: number) {
    const res = await this.gsApi.match.matchControllerGetMatch(id);
    await this.amqpConnection.publish(
      "app.events",
      MatchArtifactUploadedEvent.name,
      new MatchArtifactUploadedEvent(
        id,
        asMatchmakingMode(res.data.mode),
        MatchArtifactType.REPLAY,
        "replays",
        `${id}.dem.zip`,
      ),
    );
  }

  @Get("/highlights/:id")
  public async getHighlights(@Param("id") id: number) {
    return this.statsService.getHighlights(id);
  }

  @CacheShared()
  @CacheTTL(5)
  @Get("/maintenance")
  async maintenance(): Promise<MaintenanceDto> {
    return this.statsService.getMaintenance();
  }

  @CacheShared()
  @CacheTTL(30)
  @Get("/matchmaking")
  async getMatchmakingInfo(): Promise<MatchmakingInfo[]> {
    const [modesRes, queueTimes] = await Promise.combine([
      this.gsApi.info.infoControllerGamemodes(),
      Promise.resolve(this.statsService.stats),
    ]);

    return modesRes.data.map((mode) => {
      const localMode = asMatchmakingMode(mode.lobby_type);
      const q: [number, QueueTimeDto][] = queueTimes.map((queueTime) => [
        queueTime[0],
        queueTime[1].find((stat) => stat.mode === localMode),
      ]);

      return {
        lobby_type: localMode,
        game_mode: asGameMode(mode.game_mode),
        dota_map: asDotaMap(mode.dota_map),
        patch: asDotaPatch(mode.patch),
        enabled: mode.enabled,
        fillBots: mode.fillBots,
        enableCheats: mode.enableCheats,
        queueDurations: q.map(([hr, stat]) => ({
          duration: stat?.queueTime,
          utcHour: hr,
        })),
      };
    });
  }

  @CacheShared()
  @CacheTTL(60)
  @Get("/twitch")
  async getTwitchStreams(): Promise<TwitchStreamDto[]> {
    const streams = this.twitch.streams;

    return Promise.all(streams.map(this.mapper.mapStream));
  }

  @CacheShared()
  @CacheTTL(60 * 60) // 1 hr
  @Get("/seasons")
  async getGameSeasons(): Promise<GameSeasonDto[]> {
    const res = await this.gsApi.info.infoControllerGetSeasons();
    return res.data;
  }

  @Get("/online")
  async online(): Promise<CurrentOnlineDto> {
    return this.statsService.currentOnline();
  }

  // NOTE: getServers endpoint removed - infoControllerGameServers no longer exists in the API

  @CacheShared()
  @CacheTTL(60 * 5)
  @Get("/agg_stats")
  public async getAggStats(): Promise<AggregatedStatsDto> {
    const res = await this.gsApi.info.infoControllerGetAggregatedStats();
    return res.data;
  }
}
