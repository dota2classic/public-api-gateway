import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { InfoApi } from "../../generated-api/gameserver";
import { CurrentOnlineDto, MatchmakingInfo } from "./dto/stats.dto";
import { MatchmakingModeStatusEntity } from "../../entity/matchmaking-mode-status.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CacheTTL } from "@nestjs/cache-manager";

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
