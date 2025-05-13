import { Injectable } from "@nestjs/common";
import {
  GameserverCrimeLogDto,
  GameserverGameServerDto,
  GameserverGameSessionDto,
} from "../../generated-api/gameserver/models";
import { CrimeLogDto, GameServerDto, GameSessionDto } from "./dto/admin.dto";
import { Dota2Version } from "../../gateway/shared-types/dota2version";
import { MatchmakingMode } from "../../gateway/shared-types/matchmaking-mode";
import { UserProfileService } from "../../service/user-profile.service";

@Injectable()
export class AdminMapper {
  constructor(private readonly user: UserProfileService) {}

  public mapCrimeLog = async (
    t: GameserverCrimeLogDto,
  ): Promise<CrimeLogDto> => ({
    id: t.id,
    user: await this.user.userDto(t.steam_id),
    handled: t.handled,
    crime: t.crime,
    lobby_type: t.lobby_type,
    created_at: t.created_at,
    ban_duration: t.banTime,
    match_id: t.match_id,
  });

  public mapGameServer = (t: GameserverGameServerDto): GameServerDto => ({
    url: t.url,
    version: t.version as unknown as Dota2Version,
  });

  public mapGameSession = async (
    it: GameserverGameSessionDto,
  ): Promise<GameSessionDto> => {
    const radiant = await Promise.all(
      it.info.radiant.map(async (t) => await this.user.userDto(t)),
    );
    const dire = await Promise.all(
      it.info.dire.map(async (t) => await this.user.userDto(t)),
    );

    return {
      url: it.url,
      matchId: it.matchId,
      info: {
        ...it.info,
        radiant: radiant,
        dire: dire,
        mode: it.info.mode as unknown as MatchmakingMode,
        version: it.info.version as unknown as Dota2Version,
      },
    };
  };
}
