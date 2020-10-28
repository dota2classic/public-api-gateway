import { RuntimeRepository } from '../runtime.repository';
import { UserModel } from './user.model';
import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetAllQuery } from '../../gateway/queries/GetAll/get-all.query';
import { GetAllQueryResult } from '../../gateway/queries/GetAll/get-all-query.result';
import { GetUserInfoQuery } from '../../gateway/queries/GetUserInfo/get-user-info.query';
import { PlayerId } from '../../gateway/shared-types/player-id';
import { GetUserInfoQueryResult } from '../../gateway/queries/GetUserInfo/get-user-info-query.result';

@Injectable()
export class UserRepository extends RuntimeRepository<UserModel, 'id'> {
  constructor(private readonly qbus: QueryBus) {
    super();
  }

  public async fillCaches(){
    await this.qbus
      .execute<GetAllQuery, GetAllQueryResult>(new GetAllQuery())
      .then(result => {
        result.entries.forEach(t =>
          this.save(t.id.value, new UserModel(t.id.value, t.name)),
        );
      });
  }

  async resolve(id: UserModel['id']): Promise<UserModel> {
    return this.qbus
      .execute<GetUserInfoQuery, GetUserInfoQueryResult>(
        new GetUserInfoQuery(new PlayerId(id)),
      )
      .then(t => new UserModel(t.id.value, t.name));
  }


  public async name(id: UserModel['id']): Promise<string> {
    return this.get(id).then(t => t.name)
  }
}
