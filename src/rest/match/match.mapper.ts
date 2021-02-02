import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../cache/user/user.repository';
import {
  GameserverMatchDto,
  GameserverMatchPageDto,
  GameserverPlayerInMatchDto,
} from '../../generated-api/gameserver/models';
import { MatchDto, MatchPageDto, PlayerInMatchDto } from './dto/match.dto';
import { PlayerId } from '../../gateway/shared-types/player-id';
import { MATCH_REPORT_TIMEOUT } from '../../gateway/shared-types/timings';
import { GetReportsAvailableQueryResult } from '../../gateway/queries/GetReportsAvailable/get-reports-available-query.result';

export interface PlayerMappableResource extends GetReportsAvailableQueryResult{

}
@Injectable()
export class MatchMapper {
  constructor(private readonly userRepository: UserRepository) {}

  public mapPlayerInMatch = async (
    it: GameserverPlayerInMatchDto,
  ): Promise<PlayerInMatchDto> => {
    return {
      ...it,
      name: await this.userRepository.name(it.steam_id)
    };
  };

  public mapMatch = async (it: GameserverMatchDto, mapFor?: PlayerMappableResource): Promise<MatchDto> => {
    const timeDiff = new Date().getTime() - new Date(it.timestamp).getTime()
    const isReportable = mapFor !== undefined && timeDiff <= MATCH_REPORT_TIMEOUT && mapFor.available > 0
    return {
      ...it,
      reportable: isReportable,
      radiant: await Promise.all(it.radiant.map(this.mapPlayerInMatch)),
      dire: await Promise.all(it.dire.map(this.mapPlayerInMatch)),
    };
  };

  public mapMatchPage = async (
    it: GameserverMatchPageDto,
    mapFor?: PlayerMappableResource
  ): Promise<MatchPageDto> => {
    return {
      ...it,
      data: await Promise.all(it.data.map(t => this.mapMatch(t, mapFor))),
    };
  };
}
