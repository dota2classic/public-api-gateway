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
  GamemodeAccessMap,
  LeaderboardEntryDto,
  MeDto,
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
import { UserProfileDto } from '../../user-profile/dto/user-profile.dto';
import { UserProfileService } from '../../user-profile/service/user-profile.service';

@Injectable()
export class PlayerMapper {
  constructor(
    private readonly matchMapper: MatchMapper,
    private readonly userProfile: UserProfileService,
  ) {}

  public mapTeammate = async (
    it: GameserverPlayerTeammateDto,
  ): Promise<PlayerTeammateDto> => ({
    user: await this.userProfile.userDto(it.steam_id),

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
      id: it.steamId,
      user: await this.userProfile.userDto(it.steamId),

      games: it.games,
      kills: it.kills,
      deaths: it.deaths,
      assists: it.assists,
      wins: it.wins,
      play_time: it.playtime,
      rank: it.rank,
    };
  };

  public mapMe = async (it: UserProfileDto): Promise<MeDto> => {
    return {
      mmr: it.player.mmr,
      user: it.asUserDto(),
      roles: it.user.roles,
      id: it.user.id,
      rank: it.player.rank,
      banStatus: it.player.ban,
      reportsAvailable: it.reports.reportsAvailable,
    };
  };

  public mapPlayerSummary = async (
    it: UserProfileDto,
  ): Promise<PlayerSummaryDto> => {
    return {
      user: it.asUserDto(),
      mmr: it.player.mmr,
      id: it.user.id,
      rank: it.player.rank,
      wins: it.player.win,
      loss: it.player.loss,
      games_played: it.player.games,
      calibrationGamesLeft: it.player.calibrationGamesLeft,
      accessMap: this.mapAccessLevel(it.player.accessLevel),
      aspects: it.player.aspects,

      kills: it.player.kills,
      deaths: it.player.deaths,
      assists: it.player.assists,

      playtime: it.player.playtime,
    };
  };

  public mapAccessLevel = (it: MatchAccessLevel): GamemodeAccessMap => ({
    education: true,
    simpleModes: it !== 0,
    humanGames: it == 2,
  });

  public mapParty = async (
    party: GetPartyQueryResult,
    sessions: { result: GetSessionByUserQueryResult; steamId: string }[],
  ): Promise<PartyDto> => {
    return {
      id: party.partyId,
      leader: await this.mapPlayerInParty(party.leaderId),
      players: await Promise.all(
        party.players.map(async (plr) => {
          const profile = await this.userProfile.get(plr);
          const session = sessions.find((t) => t.steamId === plr);

          return {
            banStatus: profile.player.ban,
            session: session?.result?.serverUrl,
            summary: await this.mapPlayerSummary(profile),
          } satisfies PartyMemberDTO;
        }),
      ),
    };
  };

  public mapPlayerInParty = async (steamId: string): Promise<UserDTO> => {
    return this.userProfile.userDto(steamId);
  };

  public mapAchievement = async (
    ach: GameserverAchievementDto,
  ): Promise<AchievementDto> => {
    return {
      key: ach.key,
      user: await this.userProfile.userDto(ach.steamId),

      isComplete: ach.isComplete,
      progress: ach.progress,
      maxProgress: ach.maxProgress,

      match: ach.match ? await this.matchMapper.mapMatch(ach.match) : undefined,
    };
  };
}
