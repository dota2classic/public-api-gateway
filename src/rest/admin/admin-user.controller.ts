import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { QueryBus } from '@nestjs/cqrs';
import { InfoApi } from 'src/generated-api/gameserver/api/info-api';
import { ApiTags } from '@nestjs/swagger';
import { UpdateRolesDto } from './dto/admin.dto';
import { UserRolesUpdatedEvent } from '../../gateway/events/user/user-roles-updated.event';
import { PlayerId } from '../../gateway/shared-types/player-id';
import { AdminGuard, WithUser } from '../../utils/decorator/with-user';

@Controller('admin/users')
@ApiTags('admin')
export class AdminUserController {
  private readonly ms: InfoApi;
  constructor(
    @Inject('QueryCore') private readonly rq: ClientProxy,
    private readonly qBus: QueryBus,
  ) {}

  @AdminGuard()
  @WithUser()
  @Post('update_role')
  public async updateRole(@Body() b: UpdateRolesDto) {
    this.rq.emit('UserRolesUpdatedEvent', {
      id: new PlayerId(b.steam_id),
      roles: b.roles,
    });
  }
}
