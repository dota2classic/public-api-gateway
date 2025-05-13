import { Injectable } from "@nestjs/common";
import {
  GameserverAchievementDto,
  GameserverBanStatusDto,
  GameserverLeaderboardEntryDto,
  GameserverPlayerSummaryDto,
  GameserverPlayerTeammateDto,
} from "../../generated-api/gameserver/models";
import {
  GamemodeAccessMap,
  LeaderboardEntryDto,
  MeDto,
  PlayerStatsDto,
  PlayerSummaryDto,
  PlayerTeammateDto,
} from "./dto/player.dto";
import { numSteamId } from "../../utils/steamIds";
import { GetPartyQueryResult } from "../../gateway/queries/GetParty/get-party-query.result";
import { PartyDto, PartyMemberDTO } from "./dto/party.dto";
import { GetReportsAvailableQueryResult } from "../../gateway/queries/GetReportsAvailable/get-reports-available-query.result";
import { TournamentTeamDto } from "../../generated-api/tournament/models";
import { UserDTO } from "../shared.dto";
import { AchievementDto } from "./dto/achievement.dto";
import { MatchMapper } from "../match/match.mapper";
import { GetSessionByUserQueryResult } from "../../gateway/queries/GetSessionByUser/get-session-by-user-query.result";
import { MatchAccessLevel } from "../../gateway/shared-types/match-access-level";
import { UserProfileService } from "../../service/user-profile.service";

@Injectable()
export class PlayerMapper {
  constructor(
    private readonly userRepository: UserProfileService,
    private readonly matchMapper: MatchMapper,
  ) {}

  public mapTeammate = async (
    it: GameserverPlayerTeammateDto,
  ): Promise<PlayerTeammateDto> => ({
    user: await this.userRepository.userDto(it.steam_id),

    games: it.games,
    wins: it.wins,
    losses: it.losses,
    winrate: it.winrate,
    rank: it.rank,
  });
  public mapLeaderboardEntry = async (
    it: GameserverLeaderboardEntryDto,
  ): Promise<LeaderboardEntryDto> => {
    return {
      mmr: it.mmr,
      id: numSteamId(it.steamId),
      user: await this.userRepository.userDto(it.steamId),

      games: it.games,
      kills: it.kills,
      deaths: it.deaths,
      assists: it.assists,
      wins: it.wins,
      abandons: it.abandons,
      play_time: it.playtime,
      rank: it.rank,
    };
  };

  public mapMe = async (
    it: GameserverPlayerSummaryDto,
    status: GameserverBanStatusDto,
    team: TournamentTeamDto | undefined,
    reports?: GetReportsAvailableQueryResult,
  ): Promise<MeDto> => {
    const user = await this.userRepository.userDto(it.steamId);
    return {
      mmr: it.season.mmr,
      user: user,
      roles: user.roles,
      id: numSteamId(it.steamId),
      rank: it.season.rank,
      banStatus: {
        isBanned: status.isBanned,
        bannedUntil: status.bannedUntil,
        status: status.status,
      },
      reportsAvailable: reports?.available || 0,
    };
  };

  public mapPlayerSummary = async (
    it: GameserverPlayerSummaryDto,
  ): Promise<PlayerSummaryDto> => {
    return {
      user: await this.userRepository.userDto(it.steamId),
      id: numSteamId(it.steamId),
      calibrationGamesLeft: it.calibrationGamesLeft,
      accessMap: this.mapAccessLevel(it.accessLevel),
      aspects: it.reports,

      overallStats: this.mapPlayerStats(it.overall),
      seasonStats: this.mapPlayerStats(it.season),
    };
  };

  private mapPlayerStats = (
    it: GameserverLeaderboardEntryDto,
  ): PlayerStatsDto => ({
    rank: it.rank,
    mmr: it.mmr,
    wins: it.wins,
    abandons: it.abandons,
    loss: it.games - it.wins,
    games_played: it.games,
    kills: it.kills,
    deaths: it.deaths,
    assists: it.assists,

    playtime: it.playtime,
  });

  public mapAccessLevel = (it: MatchAccessLevel): GamemodeAccessMap => ({
    education: true,
    simpleModes: it !== 0,
    humanGames: it == 2,
  });

  public mapParty = async (
    party: GetPartyQueryResult,
    banStatuses: GameserverBanStatusDto[],
    summaries: GameserverPlayerSummaryDto[],
    sessions: { result: GetSessionByUserQueryResult; steamId: string }[],
  ): Promise<PartyDto> => {
    return {
      id: party.partyId,
      enterQueueAt: party.enterQueueTime,
      leader: await this.mapPlayerInParty(party.leaderId),
      players: await Promise.all(
        party.players.map(async (plr) => {
          const status = banStatuses.find((t) => t.steam_id === plr);
          const summary = summaries.find((t) => t.steamId === plr);
          const session = sessions.find((t) => t.steamId === plr);

          return {
            banStatus: {
              isBanned: status.isBanned,
              bannedUntil: status.bannedUntil,
              status: status.status,
            },
            session: session?.result?.serverUrl,
            summary: await this.mapPlayerSummary(summary),
          } satisfies PartyMemberDTO;
        }),
      ),
    };
  };

  public mapPlayerInParty = async (steamId: string): Promise<UserDTO> => {
    return this.userRepository.userDto(steamId);
  };

  public mapAchievement = async (
    ach: GameserverAchievementDto,
  ): Promise<AchievementDto> => {
    return {
      key: ach.key,
      user: await this.userRepository.userDto(ach.steamId),

      isComplete: ach.isComplete,
      progress: ach.progress,
      maxProgress: ach.maxProgress,

      match: ach.match ? await this.matchMapper.mapMatch(ach.match) : undefined,
    };
  };
}
