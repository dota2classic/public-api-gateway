import { Controller, Get, Param, Post, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
  GameserverGameSessionDto,
  InfoApi,
  MatchApi,
} from "../../generated-api/gameserver";
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

@UseInterceptors(ReqLoggingInterceptor)
@Controller("stats")
@ApiTags("stats")
export class StatsController {
  constructor(
    private readonly ms: InfoApi,
    private readonly match: MatchApi,
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
    const res = await this.match.matchControllerGetMatch(id);
    await this.amqpConnection.publish(
      "app.events",
      MatchArtifactUploadedEvent.name,
      new MatchArtifactUploadedEvent(
        id,
        res.mode,
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
    const [modes, queueTimes] = await Promise.combine([
      this.ms.infoControllerGamemodes(),
      Promise.resolve(this.statsService.stats),
    ]);

    return modes.map((mode) => {
      const q: [number, QueueTimeDto][] = queueTimes.map((queueTime) => [
        queueTime[0],
        queueTime[1].find((stat) => stat.mode === mode.lobby_type),
      ]);

      return {
        ...mode,
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
    return this.ms.infoControllerGetSeasons();
  }

  @UseInterceptors(GlobalHttpCacheInterceptor)
  @Get("/online")
  @CacheTTL(10) // 10 seconds
  async online(): Promise<CurrentOnlineDto> {
    const [online, sessions, servers] = await Promise.all<any>([
      this.ms.infoControllerGetCurrentOnline(),
      this.ms.infoControllerGameSessions(),
      this.ms.infoControllerGameServers(),
    ]);

    const ses = sessions as GameserverGameSessionDto[];

    const perMode: PerModePlayersDto[] = MatchmakingModes.map((mode) => {
      const sessions = ses.filter((t) => t.info.mode === mode);
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
      inGame: online,
      servers: servers.length,
      sessions: sessions.length,
      perMode,
    };
  }

  @Get("/servers")
  public async getServers(): Promise<string[]> {
    const servers = await this.ms.infoControllerGameServers();
    const hosts = new Set(servers.map((server) => server.url.split(":")[0]));
    return Array.from(hosts.values());
  }

  @UseInterceptors(GlobalHttpCacheInterceptor)
  @CacheTTL(60 * 6)
  @Get("/agg_stats")
  public async getAggStats(): Promise<AggregatedStatsDto> {
    return this.ms.infoControllerGetAggregatedStats();
  }
}
