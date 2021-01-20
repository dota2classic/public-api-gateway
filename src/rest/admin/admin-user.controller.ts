import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EventBus, QueryBus } from '@nestjs/cqrs';
import { InfoApi } from 'src/generated-api/gameserver/api/info-api';
import { ApiTags } from '@nestjs/swagger';
import { BanHammerDto, UpdateRolesDto, UserBanSummaryDto, UserRoleSummaryDto } from './dto/admin.dto';
import { UserRolesUpdatedEvent } from '../../gateway/events/user/user-roles-updated.event';
import { PlayerId } from '../../gateway/shared-types/player-id';
import { ModeratorGuard, WithUser } from '../../utils/decorator/with-user';
import { GetRoleSubscriptionsQuery } from '../../gateway/queries/user/GetRoleSubscriptions/get-role-subscriptions.query';
import { GetRoleSubscriptionsQueryResult } from '../../gateway/queries/user/GetRoleSubscriptions/get-role-subscriptions-query.result';
import { UserRepository } from '../../cache/user/user.repository';
import { GetPlayerInfoQuery } from '../../gateway/queries/GetPlayerInfo/get-player-info.query';
import { GetPlayerInfoQueryResult } from '../../gateway/queries/GetPlayerInfo/get-player-info-query.result';
import { Dota2Version } from '../../gateway/shared-types/dota2version';
import { PlayerBanHammeredEvent } from '../../gateway/events/bans/player-ban-hammered.event';

@Controller('admin/users')
@ApiTags('admin')
export class AdminUserController {
  private readonly ms: InfoApi;
  constructor(
    @Inject('QueryCore') private readonly rq: ClientProxy,
    private readonly qBus: QueryBus,
    private readonly urep: UserRepository,
    private readonly ebus: EventBus,
  ) {}

  @ModeratorGuard()
  @WithUser()
  @Post('update_role')
  public async updateRole(@Body() b: UpdateRolesDto) {
    this.rq.emit(UserRolesUpdatedEvent.name, {
      id: new PlayerId(b.steam_id),
      role: b.role,
      end_time: b.end_time,
    });
  }

  @ModeratorGuard()
  @WithUser()
  @Get('roles/:id')
  public async roleOf(@Param('id') id: string): Promise<UserRoleSummaryDto> {
    const q = await this.qBus.execute<
      GetRoleSubscriptionsQuery,
      GetRoleSubscriptionsQueryResult
    >(new GetRoleSubscriptionsQuery(new PlayerId(id)));
    return q.entries.map(t => ({
      steam_id: t.steam_id,
      name: this.urep.nameSync(t.steam_id),
      entries: t.entries.map(z => ({ ...z, steam_id: z.playerId.value })),
    }))[0];
  }

  @ModeratorGuard()
  @WithUser()
  @Get('ban/:id')
  public async banOf(@Param('id') id: string): Promise<UserBanSummaryDto> {
    const res = await this.qBus.execute<
      GetPlayerInfoQuery,
      GetPlayerInfoQueryResult
    >(new GetPlayerInfoQuery(new PlayerId(id), Dota2Version.Dota_681));

    return {
      steam_id: res.playerId.value,
      banStatus: res.banStatus,
    };
  }

  @ModeratorGuard()
  @WithUser()
  @Post('ban/:id')
  public async banId(@Param('id') id: string, @Body() b: BanHammerDto) {
    await this.rq.emit(PlayerBanHammeredEvent.name, {
      playerId: new PlayerId(id),
      endTime: b.endTime,
    });
  }

  @ModeratorGuard()
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
