import { Injectable } from '@nestjs/common';
import { GetAllQuery } from './gateway/queries/GetAll/get-all.query';
import { GetAllQueryResult } from './gateway/queries/GetAll/get-all-query.result';
import { UserRepository } from './cache/user/user.repository';
import { UserModel } from './cache/user/user.model';
import { Cron } from '@nestjs/schedule';
import { QueryBus } from '@nestjs/cqrs';
import { MatchmakingModeStatusEntity } from './entity/matchmaking-mode-status.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchmakingModes } from './gateway/shared-types/matchmaking-mode';
import { Dota2Version } from './gateway/shared-types/dota2version';

@Injectable()
export class MainService {
  constructor(
    private readonly qbus: QueryBus,
    private readonly userRepository: UserRepository,
    @InjectRepository(MatchmakingModeStatusEntity)
    private readonly matchmakingModeStatusEntityRepository: Repository<
      MatchmakingModeStatusEntity
    >,
  ) {
    const a = MatchmakingModes.map(async mode => {
      [Dota2Version.Dota_684, Dota2Version.Dota_681].map(async version => {
        let existing = await this.matchmakingModeStatusEntityRepository.findOne(
          {
            where: {
              version,
              mode,
            },
          },
        );

        if (!existing) {
          existing = new MatchmakingModeStatusEntity();
          existing.version = version;
          existing.mode = mode;
          existing.enabled = false;
          await this.matchmakingModeStatusEntityRepository.save(existing);
        }
      });
    });
  }

  @Cron('*/30 * * * * *')
  async actualizeServers() {
    const res = await this.qbus.execute<GetAllQuery, GetAllQueryResult>(
      new GetAllQuery(),
    );

    res.entries.forEach(a => {
      this.userRepository.save(
        a.id.value,
        new UserModel(a.id.value, a.name, a.avatar, a.roles),
      );
    });
  }
}
