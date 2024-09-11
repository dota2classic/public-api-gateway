import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../cache/user/user.repository';
import { GameserverPlayerHeroPerformance } from '../../generated-api/gameserver/models';
import { HeroPlayerDto } from './dto/meta.dto';

@Injectable()
export class MetaMapper {
  constructor(private readonly userRepository: UserRepository) {}

  public mapHeroPlayer = async (
    it: GameserverPlayerHeroPerformance,
  ): Promise<HeroPlayerDto> => {
    return {
      name: await this.userRepository.name(it.steam_id),
      avatar: await this.userRepository.avatar(it.steam_id),
      steam_id: it.steam_id,
      score: it.score,
      kda: it.kda,
      wins: it.wins,
      games: it.games,
    };
  };
}
