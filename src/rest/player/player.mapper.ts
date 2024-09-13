import { Injectable } from '@nestjs/common';
import {
  GameserverBanStatusDto,
  GameserverLeaderboardEntryDto,
  GameserverPlayerSummaryDto,
} from '../../generated-api/gameserver/models';
import { UserRepository } from '../../cache/user/user.repository';
import { LeaderboardEntryDto, MeDto, PlayerSummaryDto } from './dto/player.dto';
import { numSteamId } from '../../utils/steamIds';
import { GetPartyQueryResult } from '../../gateway/queries/GetParty/get-party-query.result';
import { PartyDto, PlayerInPartyDto } from './dto/party.dto';
import { PlayerId } from '../../gateway/shared-types/player-id';
import { GetReportsAvailableQueryResult } from '../../gateway/queries/GetReportsAvailable/get-reports-available-query.result';
import { TournamentTeamDto } from '../../generated-api/tournament/models';

@Injectable()
export class PlayerMapper {
  constructor(private readonly userRepository: UserRepository) {}

  public mapLeaderboardEntry = async (
    it: GameserverLeaderboardEntryDto,
  ): Promise<LeaderboardEntryDto> => {
    return {
      steam_id: it.steam_id,
      mmr: it.mmr,
      name: await this.userRepository.name(it.steam_id),
      avatar: await this.userRepository.avatar(it.steam_id),
      id: numSteamId(it.steam_id),

      games: it.games,
      kills: it.kills,
      deaths: it.deaths,
      assists: it.assists,
      wins: it.wins,
      play_time: it.play_time,
      rank: it.rank,
    };
  };

  public mapMe = async (
    it: GameserverPlayerSummaryDto,
    status: GameserverBanStatusDto,
    team: TournamentTeamDto | undefined,
    reports: GetReportsAvailableQueryResult,
  ): Promise<MeDto> => {
    return {
      steam_id: it.steam_id,
      mmr: it.mmr,
      avatar: await this.userRepository.avatar(it.steam_id),
      name: await this.userRepository.name(it.steam_id),
      roles: await this.userRepository.roles(it.steam_id),
      id: numSteamId(it.steam_id),
      rank: it.rank,
      unrankedGamesLeft: it.newbieUnrankedGamesLeft,
      banStatus: {
        isBanned: status.isBanned,
        bannedUntil: status.bannedUntil,
        status: status.status as any,
      },
      reportsAvailable: reports.available,
    };
  };

  public mapPlayerSummary = async (
    it: GameserverPlayerSummaryDto,
  ): Promise<PlayerSummaryDto> => {
    return {
      steam_id: it.steam_id,
      mmr: it.mmr,
      avatar: await this.userRepository.avatar(it.steam_id),
      name: await this.userRepository.name(it.steam_id),
      id: numSteamId(it.steam_id),
      rank: it.rank,
      unrankedGamesLeft: it.newbieUnrankedGamesLeft,
      wins: it.wins,
      loss: it.games - it.wins,
      games_played: it.games,
    };
  };

  public mapParty = async (party: GetPartyQueryResult): Promise<PartyDto> => {
    return {
      id: party.id,
      leader: await this.mapPlayerInParty(party.leader),
      players: await Promise.all(party.players.map(this.mapPlayerInParty)),
    };
  };

  public mapPlayerInParty = async (
    pid: PlayerId,
  ): Promise<PlayerInPartyDto> => {
    return {
      steam_id: pid.value,
      name: await this.userRepository.name(pid.value),
      avatar: await this.userRepository.avatar(pid.value),
    };
  };
}
