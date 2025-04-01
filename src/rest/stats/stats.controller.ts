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
} from "./dto/stats.dto";
import { CacheTTL } from "@nestjs/cache-manager";
import { ReqLoggingInterceptor } from "../../middleware/req-logging.interceptor";
import { MatchmakingModes } from "../../gateway/shared-types/matchmaking-mode";
import { HttpCacheInterceptor } from "../../utils/cache-key-track";

@UseInterceptors(ReqLoggingInterceptor, HttpCacheInterceptor)
@Controller("stats")
@ApiTags("stats")
export class StatsController {
  constructor(private readonly ms: InfoApi) {}

  @Get("/matchmaking")
  async getMatchmakingInfo(): Promise<MatchmakingInfo[]> {
    return this.ms.infoControllerGamemodes();
  }

  @CacheTTL(60_000)
  @Get("/seasons")
  async getGameSeasons(): Promise<GameSeasonDto[]> {
    return this.ms.infoControllerGetSeasons();
  }

  @Get("/servers")
  public async getServers(): Promise<string[]> {
    const servers = await this.ms.infoControllerGameServers();
    const hosts = new Set(servers.map((server) => server.url.split(":")[0]));
    return Array.from(hosts.values());
  }

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
}
