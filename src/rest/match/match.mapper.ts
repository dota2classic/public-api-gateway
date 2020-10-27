import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../cache/user/user.repository';
import {
  GameserverMatchDto,
  GameserverMatchPageDto,
  GameserverPlayerInMatchDto,
} from '../../generated-api/gameserver/models';
import { MatchDto, MatchPageDto, PlayerInMatchDto } from './dto/match.dto';

@Injectable()
export class MatchMapper {
  constructor(private readonly userRepository: UserRepository) {}

  public mapPlayerInMatch = async (
    it: GameserverPlayerInMatchDto,
  ): Promise<PlayerInMatchDto> => {
    return {
      ...it,
      name: (await this.userRepository.get(it.steam_id))?.name,
    };
  };

  public mapMatch = async (it: GameserverMatchDto): Promise<MatchDto> => {
    return {
      ...it,
      radiant: await Promise.all(it.radiant.map(this.mapPlayerInMatch)),
      dire: await Promise.all(it.dire.map(this.mapPlayerInMatch)),
    };
  };

  public mapMatchPage = async (
    it: GameserverMatchPageDto,
  ): Promise<MatchPageDto> => {
    return {
      ...it,
      data: await Promise.all(it.data.map(this.mapMatch)),
    };
  };
}
