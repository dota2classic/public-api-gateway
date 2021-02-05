import { Injectable } from '@nestjs/common';
import {
  TournamentTeamDto,
  TournamentTournamentDto,
} from '../../../generated-api/tournament/models';
import { TournamentDto } from '../dto/admin-tournament.dto';
import { TeamDto } from '../../tournament/dto/team.dto';
import { UserRepository } from '../../../cache/user/user.repository';

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
      members: await Promise.all(dto.members.map(async t => ({
        name: await this.userRepository.name(t.steam_id),
        steam_id: t.steam_id,
      }))),
    };
  };
}
