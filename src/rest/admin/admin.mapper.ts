import { Injectable } from '@nestjs/common';
import { GameserverGameServerDto, GameserverGameSessionDto } from '../../generated-api/gameserver/models';
import { GameServerDto, GameSessionDto } from './dto/admin.dto';
import { Dota2Version } from '../../gateway/shared-types/dota2version';
import { MatchmakingMode } from '../../gateway/shared-types/matchmaking-mode';

@Injectable()
export class AdminMapper {
  public mapGameServer = (t: GameserverGameServerDto): GameServerDto => ({
    url: t.url,
    version: (t.version as unknown) as Dota2Version,
  });

  public mapGameSession = (it: GameserverGameSessionDto): GameSessionDto => ({
    url: it.url,
    matchId: it.matchId,
    info: {
      ...it.info,
      mode: (it.info.mode as unknown) as MatchmakingMode,
      version: (it.info.version as unknown) as Dota2Version,
    },
  });
}
