import { Injectable } from "@nestjs/common";
import { UserRepository } from "../../cache/user/user.repository";
import { GameserverPlayerHeroPerformance } from "../../generated-api/gameserver/models";
import { HeroPlayerDto } from "./dto/meta.dto";

@Injectable()
export class MetaMapper {
  constructor(private readonly userRepository: UserRepository) {}

  public mapHeroPlayer = async (
    it: GameserverPlayerHeroPerformance,
  ): Promise<HeroPlayerDto> => {
    return {
      user: await this.userRepository.userDto(it.steam_id),
      score: it.score,
      kills: it.kills,
      deaths: it.deaths,
      assists: it.assists,
      wins: it.wins,
      games: it.games,
    };
  };
}
