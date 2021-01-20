import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { EventBus, QueryBus } from '@nestjs/cqrs';
import { UserRepository } from '../../cache/user/user.repository';
import { ModeratorGuard, WithUser } from '../../utils/decorator/with-user';
import { UpdateRolesDto } from './dto/admin.dto';
import { UserRolesUpdatedEvent } from '../../gateway/events/user/user-roles-updated.event';
import { PlayerId } from '../../gateway/shared-types/player-id';

@Controller('admin/action')
@ApiTags('admin')
export class AdminActionController {


  constructor(
    @Inject('QueryCore') private readonly rq: ClientProxy,
    private readonly qBus: QueryBus,
    private readonly urep: UserRepository,
    private readonly ebus: EventBus,
  ) {
  }



  @ModeratorGuard()
  @WithUser()
  @Post('ttt')
  public async tt(@Body() b: UpdateRolesDto) {

  }


}
