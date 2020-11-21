import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { QueryBus } from '@nestjs/cqrs';
import { InfoApi } from 'src/generated-api/gameserver/api/info-api';
import { ApiTags } from '@nestjs/swagger';
import { UpdateRolesDto, UserRoleSummaryDto } from './dto/admin.dto';
import { UserRolesUpdatedEvent } from '../../gateway/events/user/user-roles-updated.event';
import { PlayerId } from '../../gateway/shared-types/player-id';
import { AdminGuard, WithUser } from '../../utils/decorator/with-user';
import { GetRoleSubscriptionsQuery } from '../../gateway/queries/user/GetRoleSubscriptions/get-role-subscriptions.query';
import { GetRoleSubscriptionsQueryResult } from '../../gateway/queries/user/GetRoleSubscriptions/get-role-subscriptions-query.result';
import { UserRepository } from '../../cache/user/user.repository';

@Controller('admin/users')
@ApiTags('admin')
export class AdminUserController {
  private readonly ms: InfoApi;
  constructor(
    @Inject('QueryCore') private readonly rq: ClientProxy,
    private readonly qBus: QueryBus,
    private readonly urep: UserRepository,
  ) {}

  @AdminGuard()
  @WithUser()
  @Post('update_role')
  public async updateRole(@Body() b: UpdateRolesDto) {
    this.rq.emit(UserRolesUpdatedEvent.name, {
      id: new PlayerId(b.steam_id),
      role: b.role,
      end_time: b.end_time,
    });
  }

  @AdminGuard()
  @WithUser()
  @Get('roles')
  public async listRoles(): Promise<UserRoleSummaryDto[]> {
    const q = await this.qBus.execute<
      GetRoleSubscriptionsQuery,
      GetRoleSubscriptionsQueryResult
    >(new GetRoleSubscriptionsQuery());
    return q.entries.map(t => ({
      steam_id: t.steam_id,
      name: this.urep.nameSync(t.steam_id),
      entries: t.entries.map(z => ({ ...z, steam_id: z.playerId.value })),
    }));
  }
}
