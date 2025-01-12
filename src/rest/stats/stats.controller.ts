import { Controller, Get, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
  GameserverGameSessionDto,
  InfoApi,
} from "../../generated-api/gameserver";
import {
  CurrentOnlineDto,
  MatchmakingInfo,
  PerModePlayersDto,
} from "./dto/stats.dto";
import { CacheTTL } from "@nestjs/cache-manager";
import { ReqLoggingInterceptor } from "../../middleware/req-logging.interceptor";
import { MatchmakingModes } from "../../gateway/shared-types/matchmaking-mode";

@UseInterceptors(ReqLoggingInterceptor)
@Controller("stats")
@ApiTags("stats")
export class StatsController {
  constructor(private readonly ms: InfoApi) {}

  @Get("/matchmaking")
  async getMatchmakingInfo(): Promise<MatchmakingInfo[]> {
    return this.ms.infoControllerGamemodes();
  }

  @Get("/servers")
  public async getServers(): Promise<string[]> {
    const servers = await this.ms.infoControllerGameServers();
    const hosts = new Set(servers.map((server) => server.url.split(":")[0]));
    return Array.from(hosts.values());
  }

  @Get("/online")
  @CacheTTL(10)
  async online(): Promise<CurrentOnlineDto> {
    const [online, sessions, servers] = await Promise.all<any>([
      this.ms.infoControllerGetCurrentOnline(),
      this.ms.infoControllerGameSessions(),
      this.ms.infoControllerGameServers(),
    ]);

    const ses = sessions as GameserverGameSessionDto[];

    const perMode: PerModePlayersDto[] = MatchmakingModes.map((mode) => {
      const session = ses.find((t) => t.info.mode === mode);
      const playerCount = session
        ? session.info.radiant.length + session.info.dire.length
        : 0;

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
