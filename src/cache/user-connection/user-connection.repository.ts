import { RuntimeRepository } from '../runtime.repository';
import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { PlayerId } from '../../gateway/shared-types/player-id';
import { UserConnectionModel } from './user-connection.model';
import { GetAllConnectionsQuery } from '../../gateway/queries/GetAllConnections/get-all-connections.query';
import { GetAllConnectionsQueryResult } from '../../gateway/queries/GetAllConnections/get-all-connections-query.result';
import { UserModel } from '../user/user.model';
import { UserConnection } from '../../gateway/shared-types/user-connection';
import { GetConnectionsQuery } from '../../gateway/queries/GetConnections/get-connections.query';
import { GetConnectionsQueryResult } from '../../gateway/queries/GetConnections/get-connections-query.result';

@Injectable()
export class UserConnectionRepository extends RuntimeRepository<
  UserConnectionModel,
  'id'
> {
  constructor(private readonly qbus: QueryBus) {
    super();
  }

  public async fillCaches() {
    await this.qbus
      .execute<GetAllConnectionsQuery, GetAllConnectionsQueryResult>(
        new GetAllConnectionsQuery(UserConnection.DISCORD),
      )
      .then(result => {
        result.entries.forEach(t =>
          this.save(
            t.id.value,
            new UserConnectionModel(t.id.value, t.connection, t.externalId),
          ),
        );
      });
  }

  async resolve(id: UserModel['id']): Promise<UserConnectionModel> {
    return this.qbus
      .execute<GetConnectionsQuery, GetConnectionsQueryResult>(
        // todo?
        new GetConnectionsQuery(new PlayerId(id), UserConnection.DISCORD),
      )
      .then(
        t =>
          new UserConnectionModel(
            t.con?.id.value,
            t?.con.connection,
            t.con.externalId,
          ),
      );
  }
}
