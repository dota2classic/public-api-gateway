import { Controller, Get, Param, Post, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiClient } from "@dota2classic/gs-api-generated/dist/module";
import {
  AggregatedStatsDto,
  CurrentOnlineDto,
  GameSeasonDto,
  MaintenanceDto,
  MatchmakingInfo,
  PerModePlayersDto,
  QueueTimeDto,
  TwitchStreamDto,
} from "./stats.dto";
import { CacheTTL } from "@nestjs/cache-manager";
import { ReqLoggingInterceptor } from "../../middleware/req-logging.interceptor";
import { MatchmakingModes } from "../../gateway/shared-types/matchmaking-mode";
import { GlobalHttpCacheInterceptor } from "../../utils/cache-global";
import { TwitchService } from "../twitch.service";
import { StatsMapper } from "./stats.mapper";
import { StatsService } from "./stats.service";
import { MaintenanceEntity } from "../../entity/maintenance.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { DemoHighlightsEntity } from "../../entity/demo-highlights.entity";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { MatchArtifactUploadedEvent } from "../../gateway/events/match-artifact-uploaded.event";
import { MatchArtifactType } from "../../gateway/shared-types/match-artifact-type";
import {
  asMatchmakingMode,
  asGameMode,
  asDotaMap,
  asDotaPatch,
} from "../../types/gs-api-compat";

@UseInterceptors(ReqLoggingInterceptor)
@Controller("stats")
@ApiTags("stats")
export class StatsController {
  constructor(
    private readonly gsApi: ApiClient,
    private readonly twitch: TwitchService,
    private readonly mapper: StatsMapper,
    private readonly statsService: StatsService,
    @InjectRepository(MaintenanceEntity)
    private readonly maintenanceEntityRepository: Repository<MaintenanceEntity>,
    @InjectRepository(DemoHighlightsEntity)
    private readonly demoHighlightsEntityRepository: Repository<DemoHighlightsEntity>,
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
    return this.demoHighlightsEntityRepository.findOneBy({
      matchId: id,
    });
  }

  @UseInterceptors(GlobalHttpCacheInterceptor)
  @CacheTTL(5)
  @Get("/maintenance")
  async maintenance(): Promise<MaintenanceDto> {
    const m = await this.maintenanceEntityRepository.find({});
    if (m.length === 0) {
      return {
        active: false,
      };
    }

    return {
      active: m[0].active,
    };
  }

  @UseInterceptors(GlobalHttpCacheInterceptor)
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

  @UseInterceptors(GlobalHttpCacheInterceptor)
  @CacheTTL(60)
  @Get("/twitch")
  async getTwitchStreams(): Promise<TwitchStreamDto[]> {
    const streams = this.twitch.streams;

    return Promise.all(streams.map(this.mapper.mapStream));
  }

  @UseInterceptors(GlobalHttpCacheInterceptor)
  @CacheTTL(60 * 60) // 1 hr
  @Get("/seasons")
  async getGameSeasons(): Promise<GameSeasonDto[]> {
    const res = await this.gsApi.info.infoControllerGetSeasons();
    return res.data;
  }

  @UseInterceptors(GlobalHttpCacheInterceptor)
  @Get("/online")
  @CacheTTL(10) // 10 seconds
  async online(): Promise<CurrentOnlineDto> {
    const [onlineRes, sessionsRes] = await Promise.all([
      this.gsApi.info.infoControllerGetCurrentOnline(),
      this.gsApi.info.infoControllerGameSessions(),
    ]);

    const ses = sessionsRes.data;

    const perMode: PerModePlayersDto[] = MatchmakingModes.map((mode) => {
      const sessions = ses.filter((t) => asMatchmakingMode(t.info.mode) === mode);
      const playerCount = sessions.reduce(
        (a, b) => a + b.info.radiant.length + b.info.dire.length,
        0,
      );

      return {
        lobby_type: mode,
        playerCount,
      };
    });

    return {
      inGame: onlineRes.data,
      servers: 0,
      sessions: sessionsRes.data.length,
      perMode,
    };
  }

  // NOTE: getServers endpoint removed - infoControllerGameServers no longer exists in the API

  @UseInterceptors(GlobalHttpCacheInterceptor)
  @CacheTTL(60 * 5)
  @Get("/agg_stats")
  public async getAggStats(): Promise<AggregatedStatsDto> {
    const res = await this.gsApi.info.infoControllerGetAggregatedStats();
    return res.data;
  }
}
