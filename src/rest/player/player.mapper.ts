import { Injectable } from "@nestjs/common";
import {
  GameserverAchievementDto,
  GameserverBanStatusDto,
  GameserverLeaderboardEntryDto,
  GameserverPlayerSummaryDto,
  GameserverPlayerTeammateDto,
} from "../../generated-api/gameserver/models";
import { UserRepository } from "../../cache/user/user.repository";
import {
  LeaderboardEntryDto,
  MeDto,
  PlayerSummaryDto,
  PlayerTeammateDto,
} from "./dto/player.dto";
import { numSteamId } from "../../utils/steamIds";
import { GetPartyQueryResult } from "../../gateway/queries/GetParty/get-party-query.result";
import { PartyDto, PartyMemberDTO } from "./dto/party.dto";
import { PlayerId } from "../../gateway/shared-types/player-id";
import { GetReportsAvailableQueryResult } from "../../gateway/queries/GetReportsAvailable/get-reports-available-query.result";
import { TournamentTeamDto } from "../../generated-api/tournament/models";
import { UserDTO } from "../shared.dto";
import { AchievementDto } from "./dto/achievement.dto";
import { MatchMapper } from "../match/match.mapper";
import { GetSessionByUserQueryResult } from "../../gateway/queries/GetSessionByUser/get-session-by-user-query.result";

@Injectable()
export class PlayerMapper {
  constructor(
    private readonly userRepository: UserRepository,
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
      id: numSteamId(it.steam_id),
      user: await this.userRepository.userDto(it.steam_id),

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
      mmr: it.mmr,
      user: await this.userRepository.userDto(it.steam_id),
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
      user: await this.userRepository.userDto(it.steam_id),
      mmr: it.mmr,
      id: numSteamId(it.steam_id),
      rank: it.rank,
      unrankedGamesLeft: it.newbieUnrankedGamesLeft,
      playedAnyGame: it.playedAnyGame,
      wins: it.wins,
      loss: it.games - it.wins,
      games_played: it.games,
    };
  };

  public mapParty = async (
    party: GetPartyQueryResult,
    banStatuses: GameserverBanStatusDto[],
    summaries: GameserverPlayerSummaryDto[],
    sessions: { result: GetSessionByUserQueryResult; pid: PlayerId }[],
  ): Promise<PartyDto> => {
    return {
      id: party.id,
      leader: await this.mapPlayerInParty(party.leader),
      players: await Promise.all(
        party.players.map(async (plr) => {
          const status = banStatuses.find((t) => t.steam_id === plr.value);
          const summary = summaries.find((t) => t.steam_id === plr.value);
          const session = sessions.find((t) => t.pid.value === plr.value);

          return {
            banStatus: {
              isBanned: status.isBanned,
              bannedUntil: status.bannedUntil,
              status: status.status as any,
            },
            session: session?.result?.serverUrl,
            summary: await this.mapPlayerSummary(summary),
          } satisfies PartyMemberDTO;
        }),
      ),
    };
  };

  public mapPlayerInParty = async (pid: PlayerId): Promise<UserDTO> => {
    return this.userRepository.userDto(pid.value);
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
