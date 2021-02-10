import { Injectable } from '@nestjs/common';
import {
  TournamentBracketDto,
  TournamentBracketRoundDto,
  TournamentCompactTeamDto,
  TournamentFullTournamentDto,
  TournamentFullTournamentDtoEntryTypeEnum,
  TournamentFullTournamentDtoStatusEnum,
  TournamentSeedItemDto,
  TournamentTeamDto,
  TournamentTournamentDto,
  TournamentTournamentMatchDto,
} from '../../../generated-api/tournament/models';
import { FullTournamentDto, TournamentDto, TournamentMatchDto } from '../dto/admin-tournament.dto';
import { CompactTeamDto, TeamDto } from '../../tournament/dto/team.dto';
import { UserRepository } from '../../../cache/user/user.repository';
import { BracketDto, BracketRoundDto, RoundType, SeedItemDto } from '../../tournament/dto/tournament.dto';
import { CurrentUserDto } from '../../../utils/decorator/current-user';
import { PlayerPreviewDto } from '../../player/dto/player.dto';

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

  public mapFullTournament = async (
    dto: TournamentFullTournamentDto,
    user?: CurrentUserDto,
  ): Promise<FullTournamentDto> => {
    const isTeamTournament =
      dto.entryType === TournamentFullTournamentDtoEntryTypeEnum.TEAM;

    let isParticipating: boolean = false;

    const isLocked = dto.status !== TournamentFullTournamentDtoStatusEnum.NEW;
    if (isTeamTournament) {
      isParticipating = !!dto.participants.find(t =>
        t.team!!.members.find(p => p.steam_id === user.steam_id),
      );
    } else {
      isParticipating = !!dto.participants.find(
        t => t.steam_id === user.steam_id,
      );
    }

    return {
      name: dto.name,
      entryType: dto.entryType as any,
      id: dto.id,
      startDate: dto.startDate,
      status: dto.status as any,
      imageUrl: dto.imageUrl,
      participants: await Promise.all(
        dto.participants.map(async p => ({
          profile:
            p.steam_id && (await this.userRepository.resolve(p.steam_id)),
          team: p.team && (await this.mapTeam(p.team)),
        })),
      ),
      standings: await Promise.all(
        dto.standings.map(async p => ({
          profile:
            p.steam_id && (await this.userRepository.resolve(p.steam_id)),
          team: p.team && (await this.mapTeam(p.team)),
          position: p.position
        })),
      ),
      isLocked: isLocked,
      isParticipating: isParticipating,
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

  private mapPlayerPreview = async (
    steam_id: string,
  ): Promise<PlayerPreviewDto> => {
    return this.userRepository.resolve(steam_id).then(t => t?.asPreview());
  };
  private mapSeed = async (
    team: TournamentSeedItemDto,
  ): Promise<SeedItemDto | null> => {
    if (!team) {
      return null;
    } else if (team?.team) {
      return {
        isTeam: true,
        team: await this.mapTeam(team.team),
        result: team.result,
      };
    } else if (team.steam_id) {
      return {
        isTeam: false,
        profile: await this.mapPlayerPreview(team.steam_id),
        result: team.result,
      };
    } else if (team.tbd) {
      // its tbd 4sure
      return {
        isTeam: false,
        tbd: true,
      };
    } else {
      return {
        isTeam: false,
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

  public mapTournamentMatch = async (
    dto: TournamentTournamentMatchDto,
  ): Promise<TournamentMatchDto> => {
    return {
      id: dto.id,
      status: dto.status as any,
      scheduledDate: dto.scheduledDate,
      externalMatchId: dto.externalMatchId,
      teamOffset: dto.teamOffset,
      opponent1: dto.opponent1 && (await this.mapSeed(dto.opponent1)),
      opponent2: dto.opponent2 && (await this.mapSeed(dto.opponent2)),
    };
  };
}
