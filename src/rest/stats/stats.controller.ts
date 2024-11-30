import { Controller, Get, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { InfoApi } from "../../generated-api/gameserver";
import { CurrentOnlineDto, MatchmakingInfo } from "./dto/stats.dto";
import { MatchmakingModeStatusEntity } from "../../entity/matchmaking-mode-status.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CacheTTL } from "@nestjs/cache-manager";
import { ReqLoggingInterceptor } from "../../middleware/req-logging.interceptor";

@UseInterceptors(ReqLoggingInterceptor)
@Controller("stats")
@ApiTags("stats")
export class StatsController {
  constructor(
    @InjectRepository(MatchmakingModeStatusEntity)
    private readonly matchmakingModeStatusEntityRepository: Repository<MatchmakingModeStatusEntity>,
    private readonly ms: InfoApi,
  ) {}

  @Get("/matchmaking")
  async getMatchmakingInfo(): Promise<MatchmakingInfo[]> {
    return this.matchmakingModeStatusEntityRepository.find();
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

    return {
      inGame: online,
      servers: servers.length,
      sessions: sessions.length,
    };
  }
}
