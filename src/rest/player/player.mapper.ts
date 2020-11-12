import { Injectable } from '@nestjs/common';
import { GameserverLeaderboardEntryDto, GameserverPlayerSummaryDto } from '../../generated-api/gameserver/models';
import { UserRepository } from '../../cache/user/user.repository';
import { LeaderboardEntryDto, PlayerSummaryDto } from './dto/player.dto';
import { numSteamId } from '../../utils/steamIds';
import { GetPartyQueryResult } from '../../gateway/queries/GetParty/get-party-query.result';
import { PartyDto, PlayerInPartyDto } from './dto/party.dto';
import { PlayerId } from '../../gateway/shared-types/player-id';

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

  public mapParty = async (party: GetPartyQueryResult): Promise<PartyDto> => {
    return {
      id: party.id,
      leader: await this.mapPlayerInParty(party.leader),
      players: await Promise.all(party.players.map(this.mapPlayerInParty)),
    };
  };

  public mapPlayerInParty = async (pid: PlayerId): Promise<PlayerInPartyDto> => {
    return {
      steam_id: pid.value,
      name: await this.userRepository.name(pid.value),
      avatar: await this.userRepository.avatar(pid.value),
    };
  };
}
