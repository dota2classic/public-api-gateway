import { Controller, Get, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
  GameserverGameSessionDto,
  InfoApi,
} from "../../generated-api/gameserver";
import {
  CurrentOnlineDto,
  GameSeasonDto,
  MatchmakingInfo,
  PerModePlayersDto,
  QueueTimeDto,
  TwitchStreamDto,
} from "./dto/stats.dto";
import { CacheTTL } from "@nestjs/cache-manager";
import { ReqLoggingInterceptor } from "../../middleware/req-logging.interceptor";
import {
  MatchmakingMode,
  MatchmakingModes,
} from "../../gateway/shared-types/matchmaking-mode";
import { PrometheusDriver } from "prometheus-query";
import { avg } from "../../utils/average";
import { range } from "../../utils/range";
import { GlobalHttpCacheInterceptor } from "../../utils/cache-global";
import { TwitchService } from "../twitch.service";
import { StatsMapper } from "./stats.mapper";

@UseInterceptors(ReqLoggingInterceptor)
@Controller("stats")
@ApiTags("stats")
export class StatsController {
  constructor(
    private readonly ms: InfoApi,
    private readonly prom: PrometheusDriver,
    private readonly twitch: TwitchService,
    private readonly mapper: StatsMapper,
  ) {}

  @UseInterceptors(GlobalHttpCacheInterceptor)
  @CacheTTL(300)
  @Get("/matchmaking")
  async getMatchmakingInfo(): Promise<MatchmakingInfo[]> {
    const [modes, queueTimes] = await Promise.combine([
      this.ms.infoControllerGamemodes(),
      this.queueTimesChart(),
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
    const streams = await this.twitch.getLiveStreamingDota();

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

  private async queueTimesChart(
    utcDayOfWeek = new Date().getUTCDay(),
  ): Promise<[number, QueueTimeDto[]][]> {
    return Promise.all(
      range(24).map(async (utcHour) => [
        utcHour,
        await this.queueTimes(utcHour, utcDayOfWeek),
      ]),
    );
  }

  private async queueTimes(
    utcHour = new Date().getUTCHours(),
    utcDayOfWeek = new Date().getUTCDay(),
  ): Promise<QueueTimeDto[]> {
    try {
      const start = Date.now() - 1000 * 60 * 60 * 24 * 28; // 4 weeks ago
      const end = new Date();
      const step = 60 * 30; // 1 point every 6 hours

      const some = await this.prom.rangeQuery(
        `(rate(d2c_queue_time_sum[1h] ) / rate(d2c_queue_time_count[1h])) and on () (hour() == ${utcHour} and day_of_week() == ${utcDayOfWeek})`,
        start,
        end,
        step,
      );

      return some.result.map((result) => {
        const numbers = result.values
          .filter((t) => t.value !== null && !Number.isNaN(t.value))
          .map((v) => v.value / 1000);
        return {
          mode: Number(result.metric.labels.mode) as MatchmakingMode,
          queueTime: avg(numbers),
        };
      });
    } catch (e) {
      return [];
    }
  }
}
