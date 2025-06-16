import { Controller, Get, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
  GameserverGameSessionDto,
  InfoApi,
} from "../../generated-api/gameserver";
import {
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

@UseInterceptors(ReqLoggingInterceptor)
@Controller("stats")
@ApiTags("stats")
export class StatsController {
  constructor(
    private readonly ms: InfoApi,
    private readonly twitch: TwitchService,
    private readonly mapper: StatsMapper,
    private readonly statsService: StatsService,
    @InjectRepository(MaintenanceEntity)
    private readonly maintenanceEntityRepository: Repository<MaintenanceEntity>,
  ) {}

  @Get("/maintenance")
  async maintenance(): Promise<MaintenanceDto> {
    const m = await this.maintenanceEntityRepository.findOne({});
    if (!m) {
      return {
        active: false,
      };
    }

    return {
      active: m.active,
    };
  }

  @UseInterceptors(GlobalHttpCacheInterceptor)
  @CacheTTL(300)
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
  @CacheTTL(60_000)
  @Get("/seasons")
  async getGameSeasons(): Promise<GameSeasonDto[]> {
    return this.ms.infoControllerGetSeasons();
  }

  @UseInterceptors(GlobalHttpCacheInterceptor)
  @Get("/online")
  @CacheTTL(1000)
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
}
