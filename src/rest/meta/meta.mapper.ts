import { Injectable } from "@nestjs/common";
import * as GsApi from "@dota2classic/gs-api-generated/dist/Api";
import { HeroPlayerDto } from "./dto/meta.dto";
import { UserProfileService } from "../../service/user-profile.service";

@Injectable()
export class MetaMapper {
  constructor(private readonly user: UserProfileService) {}

  public mapHeroPlayer = async (
    it: GsApi.PlayerHeroPerformance,
  ): Promise<HeroPlayerDto> => {
    return {
      user: await this.user.userDto(it.steam_id),
      score: it.score,
      kills: it.kills,
      deaths: it.deaths,
      assists: it.assists,
      wins: it.wins,
      games: it.games,
    };
  };
}
