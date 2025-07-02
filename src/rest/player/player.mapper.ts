import { Injectable } from "@nestjs/common";
import {
  GameserverAchievementDto,
  GameserverBanStatusDto,
  GameserverDodgeListEntryDto,
  GameserverLeaderboardEntryDto,
  GameserverPlayerSummaryDto,
  GameserverPlayerTeammateDto,
  GameserverReportsAvailableDto,
} from "../../generated-api/gameserver/models";
import {
  DodgeListEntryDto,
  GamemodeAccessMap,
  LeaderboardEntryDto,
  MeDto,
  PlayerStatsDto,
  PlayerSummaryDto,
  PlayerTeammateDto,
} from "./dto/player.dto";
import { numSteamId } from "../../utils/steamIds";
import { PartyDto, PartyMemberDTO } from "./dto/party.dto";
import { RoleLifetimeDto, UserDTO } from "../shared.dto";
import { AchievementDto } from "./dto/achievement.dto";
import { MatchMapper } from "../match/match.mapper";
import { MatchAccessLevel } from "../../gateway/shared-types/match-access-level";
import { UserProfileService } from "../../service/user-profile.service";
import { RoleLifetime } from "../../gateway/caches/user-fast-profile.dto";
import { MatchmakerGetPartyQueryResultDto } from "../../generated-api/matchmaker";
import { LobbySlotEntity } from "../../entity/lobby-slot.entity";

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

  public mapRole = (rl: RoleLifetime): RoleLifetimeDto => ({
    role: rl.role,
    endTime: rl.endTime,
  });

  public mapMe = async (
    it: GameserverPlayerSummaryDto,
    status: GameserverBanStatusDto,
    reports?: GameserverReportsAvailableDto,
  ): Promise<MeDto> => {
    const user = await this.userRepository.userDto(it.steamId);
    return {
      mmr: it.season.mmr,
      user: user,
      id: numSteamId(it.steamId),
      rank: it.season.rank,
      banStatus: {
        isBanned: status.isBanned,
        bannedUntil: status.bannedUntil,
        status: status.status,
      },
      reportsAvailable: reports?.count || 0,
    };
  };

  public mapPlayerSummary = async (
    it: GameserverPlayerSummaryDto,
    status: GameserverBanStatusDto,
  ): Promise<PlayerSummaryDto> => {
    return {
      user: await this.userRepository.userDto(it.steamId),
      id: numSteamId(it.steamId),
      calibrationGamesLeft: it.calibrationGamesLeft,
      accessMap: this.mapAccessLevel(it.accessLevel),
      aspects: it.reports,
      banStatus: {
        isBanned: status.isBanned,
        bannedUntil: status.bannedUntil,
        status: status.status,
      },
      session: it.session
        ? {
            lobbyType: it.session.lobbyType,
            matchId: it.session.matchId,
            serverUrl: it.session.serverUrl,
          }
        : undefined,
      recalibration: it.recalibration,
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
    recalibrationAttempted: it.recalibrationAttempted,

    playtime: it.playtime,
  });

  public mapAccessLevel = (it: MatchAccessLevel): GamemodeAccessMap => ({
    education: true,
    simpleModes: it !== 0,
    humanGames: it == 2,
  });

  public mapParty = async (
    party: MatchmakerGetPartyQueryResultDto,
    banStatuses: GameserverBanStatusDto[],
    summaries: GameserverPlayerSummaryDto[],
    lobbies: (LobbySlotEntity | undefined)[],
  ): Promise<PartyDto> => {
    return {
      id: party.partyId,
      enterQueueAt: party.enterQueueTime,
      leader: await this.mapPlayerInParty(party.leaderId),
      players: await Promise.all(
        party.players.map(async (plr) => {
          const status = banStatuses.find((t) => t.steam_id === plr);
          const summary = summaries.find((t) => t.steamId === plr);
          const lobby = lobbies.find((t) => t?.steamId === plr);

          return {
            session: summary.session,
            summary: await this.mapPlayerSummary(summary, status),
            lobbyId: lobby?.lobbyId,
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

  public mapDodgeEntry = async (
    it: GameserverDodgeListEntryDto,
  ): Promise<DodgeListEntryDto> => ({
    user: await this.userRepository.userDto(it.steamId),
    createdAt: it.createdAt,
  });
}
