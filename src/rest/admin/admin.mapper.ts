import { Injectable } from "@nestjs/common";
import * as GsApi from "@dota2classic/gs-api-generated/dist/Api";
import { CrimeLogDto, GameSessionDto } from "./dto/admin.dto";
import { Dota2Version } from "../../gateway/shared-types/dota2version";
import { UserProfileService } from "../../service/user-profile.service";
import { asMatchmakingMode, asBanReason } from "../../types/gs-api-compat";

@Injectable()
export class AdminMapper {
  constructor(private readonly user: UserProfileService) {}

  public mapCrimeLog = async (t: GsApi.CrimeLogDto): Promise<CrimeLogDto> => ({
    id: t.id,
    user: await this.user.userDto(t.steam_id),
    handled: t.handled,
    crime: asBanReason(t.crime),
    lobby_type: asMatchmakingMode(t.lobby_type),
    created_at: t.created_at,
    ban_duration: t.banTime,
    match_id: t.match_id,
  });

  public mapGameSession = async (
    it: GsApi.GameSessionDto,
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
        mode: asMatchmakingMode(it.info.mode),
        version: it.info.version as unknown as Dota2Version,
      },
    };
  };
}
