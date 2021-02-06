import { Injectable } from '@nestjs/common';
import {
  TournamentBracketDto,
  TournamentBracketRoundDto,
  TournamentCompactTeamDto,
  TournamentSeedItemDto,
  TournamentTeamDto,
  TournamentTournamentDto,
} from '../../../generated-api/tournament/models';
import { TournamentDto } from '../dto/admin-tournament.dto';
import { CompactTeamDto, TeamDto } from '../../tournament/dto/team.dto';
import { UserRepository } from '../../../cache/user/user.repository';
import {
  BracketDto,
  BracketRoundDto,
  RoundType,
  SeedItemDto,
} from '../../tournament/dto/tournament.dto';

@Injectable()
export class TournamentMapper {
  constructor(private readonly userRepository: UserRepository) {}
  public mapTournament = (dto: TournamentTournamentDto): TournamentDto => {
    return {
      name: dto.name,
      entryType: dto.entryType as any,
      id: dto.id,
      startDate: dto.startDate,
      status: dto.status,
      imageUrl: dto.imageUrl,
    };
  };

  public mapTeam = async (dto: TournamentTeamDto): Promise<TeamDto> => {
    return {
      name: dto.name,
      tag: dto.tag,
      id: dto.id,
      imageUrl: dto.imageUrl,
      creator: dto.creator,
      members: await Promise.all(
        dto.members.map(async t => ({
          name: await this.userRepository.name(t.steam_id),
          steam_id: t.steam_id,
          avatar: await this.userRepository.avatar(t.steam_id),
        })),
      ),
    };
  };

  private mapSeed = async (
    team: TournamentSeedItemDto,
  ): Promise<SeedItemDto | null> => {
    if (!team) {
      return null;
    } else if (team?.team) {
      return {
        team: await this.mapTeam(team.team),
        result: team.result,
      };
    } else if (team.steam_id) {
      return {
        playerName: await this.userRepository.name(team.steam_id),
        steam_id: team.steam_id,
        result: team.result,
      };
    } else if (team.tbd) {
      // its tbd 4sure
      return {
        steam_id: null,
        tbd: true,
      };
    } else {
      return {
        steam_id: null,
        tbd: true,
      };
    }
  };

  private mapRound = async (
    round: TournamentBracketRoundDto,
    all: TournamentBracketRoundDto[],
  ): Promise<BracketRoundDto> => {
    const isFinal =
      [...all].sort((a, b) => b.round - a.round)[0].round === round.round;

    return {
      round: round.round,
      title: round.title,
      rType: isFinal ? RoundType.FINAL : RoundType.CASUAL,
      seeds: await Promise.all(
        round.seeds.map(async seed => {
          const teams = await Promise.all(seed.teams.map(this.mapSeed));

          return {
            teams,
            date: seed.date,
            id: seed.id,
            matchId: seed.matchId,
          };
        }),
      ),
    };
  };
  public mapBracket = async (
    dto: TournamentBracketDto,
  ): Promise<BracketDto> => {
    return {
      type: dto.type as any,
      winning: await Promise.all(
        dto.winning.map(t => this.mapRound(t, dto.winning)),
      ),
      losing: await Promise.all(
        dto.losing.map(t => this.mapRound(t, dto.losing)),
      ),
    };
  };

  public mapTeamCompact = async (
    dto: TournamentCompactTeamDto,
  ): Promise<CompactTeamDto> => {
    return {
      name: dto.name,
      tag: dto.tag,
      id: dto.id,
      imageUrl: dto.imageUrl,
      creator: dto.creator,
    };
  };
}
