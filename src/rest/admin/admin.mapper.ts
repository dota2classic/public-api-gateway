import { Injectable } from '@nestjs/common';
import { GameserverGameServerDto, GameserverGameSessionDto } from '../../generated-api/gameserver/models';
import { GameServerDto, GameSessionDto } from './dto/admin.dto';
import { Dota2Version } from '../../gateway/shared-types/dota2version';
import { MatchmakingMode } from '../../gateway/shared-types/matchmaking-mode';
import { UserRepository } from '../../cache/user/user.repository';

@Injectable()
export class AdminMapper {

  constructor(private readonly userRep: UserRepository) {
  }
  public mapGameServer = (t: GameserverGameServerDto): GameServerDto => ({
    url: t.url,
    version: (t.version as unknown) as Dota2Version,
  });

  public mapGameSession = (it: GameserverGameSessionDto): GameSessionDto => {

    const radiant = it.info.radiant.map(t => this.userRep.nameSync(t))
    const dire = it.info.dire.map(t => this.userRep.nameSync(t))

    return {
      url: it.url,
      matchId: it.matchId,
      info: {
        ...it.info,
        radiant: radiant,
        dire: dire,
        mode: (it.info.mode as unknown) as MatchmakingMode,
        version: (it.info.version as unknown) as Dota2Version,
      },
    }
  };
}
