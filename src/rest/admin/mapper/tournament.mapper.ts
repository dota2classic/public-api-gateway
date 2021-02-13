import { Injectable } from '@nestjs/common';
import {
  TournamentCompactTeamDto,
  TournamentFullTournamentDto,
  TournamentFullTournamentDtoEntryTypeEnum,
  TournamentFullTournamentDtoStatusEnum,
  TournamentTeamDto,
  TournamentTeamInvitationDto,
  TournamentTournamentDto,
} from '../../../generated-api/tournament/models';
import { FullTournamentDto, TournamentDto } from '../dto/admin-tournament.dto';
import {
  CompactTeamDto,
  TeamDto,
  TeamInvitationDto,
} from '../../tournament/dto/team.dto';
import { UserRepository } from '../../../cache/user/user.repository';
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

      standings:
        dto.standings &&
        (await Promise.all(
          dto.standings.map(async p => ({
            profile:
              p.steam_id && (await this.userRepository.resolve(p.steam_id)),
            team: p.team && (await this.mapTeam(p.team)),
            position: p.position,
          })),
        )),
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

  mapPlayerPreview = async (steam_id: string): Promise<PlayerPreviewDto> => {
    return this.userRepository.resolve(steam_id).then(t => t?.asPreview());
  };

  public mapTeamCompact = (dto: TournamentCompactTeamDto): CompactTeamDto => {
    return {
      name: dto.name,
      tag: dto.tag,
      id: dto.id,
      imageUrl: dto.imageUrl,
      creator: dto.creator,
    };
  };

  public mapTeamInvite = (
    dto: TournamentTeamInvitationDto,
  ): TeamInvitationDto => {
    return {
      team: this.mapTeamCompact(dto.team),
      inviteId: dto.inviteId,
    };
  };
}
