import { RuntimeRepository } from '../runtime.repository';
import { UserModel } from './user.model';
import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetAllQuery } from '../../gateway/queries/GetAll/get-all.query';
import { GetAllQueryResult } from '../../gateway/queries/GetAll/get-all-query.result';
import { GetUserInfoQuery } from '../../gateway/queries/GetUserInfo/get-user-info.query';
import { PlayerId } from '../../gateway/shared-types/player-id';
import { GetUserInfoQueryResult } from '../../gateway/queries/GetUserInfo/get-user-info-query.result';
import { Role } from '../../gateway/shared-types/roles';

@Injectable()
export class UserRepository extends RuntimeRepository<UserModel, 'id'> {
  constructor(private readonly qbus: QueryBus) {
    super();
  }

  async resolve(id: UserModel['id']): Promise<UserModel> {
    const cached = this.get(id);
    const newVersion = this.qbus
      .execute<GetUserInfoQuery, GetUserInfoQueryResult>(
        new GetUserInfoQuery(new PlayerId(id)),
      )
      .then(t => {
        const u = new UserModel(t.id.value, t.name, t.avatar, t.roles);
        this.save(u.id, u);
        return u;
      });

    if (cached) {
      return cached;
    } else {
      return await newVersion;
    }
  }

  public async name(id: UserModel['id']): Promise<string> {
    return this.resolve(id).then(t => t.name);
  }

  public async roles(id: UserModel['id']): Promise<Role[]> {
    return this.resolve(id)
      .then(t => t.roles)
      .catch(() => []);
  }

  public async avatar(id: UserModel['id']): Promise<string> {
    return this.resolve(id).then(t => t.avatar);
  }

  public nameSync(id: UserModel['id']): string | undefined {
    return this.getSync(id)?.name;
  }
}
