import { Injectable } from '@nestjs/common';
import {
  GameserverLeaderboardEntryDto,
  GameserverPlayerSummaryDto,
} from '../../generated-api/gameserver/models';
import { UserRepository } from '../../cache/user/user.repository';
import { LeaderboardEntryDto, PlayerSummaryDto } from './dto/player.dto';
import { numSteamId, steam64to32 } from '../../utils/steamIds';

@Injectable()
export class PlayerMapper {
  constructor(private readonly userRepository: UserRepository) {}

  public mapLeaderboardEntry = async (
    it: GameserverLeaderboardEntryDto,
    rank: number,
  ): Promise<LeaderboardEntryDto> => {
    return {
      steam_id: it.steam_id,
      mmr: it.mmr,
      name: await this.userRepository.name(it.steam_id),
      id: numSteamId(it.steam_id),
      rank,
    };
  };

  public mapPlayerSummary = async (
    it: GameserverPlayerSummaryDto,
  ): Promise<PlayerSummaryDto> => {
    return {
      steam_id: it.steam_id,
      mmr: it.mmr,
      name: await this.userRepository.name(it.steam_id),
      id: numSteamId(it.steam_id),
      rank: it.rank,
    };
  };
}
