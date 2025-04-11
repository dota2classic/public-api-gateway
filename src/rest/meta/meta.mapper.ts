import { Injectable } from "@nestjs/common";
import { GameserverPlayerHeroPerformance } from "../../generated-api/gameserver/models";
import { HeroPlayerDto } from "./dto/meta.dto";
import { UserProfileService } from "../../user-profile/service/user-profile.service";

@Injectable()
export class MetaMapper {
  constructor(private readonly user: UserProfileService) {}

  public mapHeroPlayer = async (
    it: GameserverPlayerHeroPerformance,
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
