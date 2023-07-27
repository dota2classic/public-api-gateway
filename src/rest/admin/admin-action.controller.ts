import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { ModeratorGuard, WithUser } from '../../utils/decorator/with-user';
import { UpdateModeDTO, UpdateRolesDto } from './dto/admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchmakingModeStatusEntity } from '../../entity/matchmaking-mode-status.entity';
import { Repository } from 'typeorm';

@Controller('admin/action')
@ApiTags('admin')
export class AdminActionController {
  constructor(
    @Inject('QueryCore') private readonly rq: ClientProxy,
    @InjectRepository(MatchmakingModeStatusEntity)
    private readonly matchmakingModeStatusEntityRepository: Repository<
      MatchmakingModeStatusEntity
    >,
  ) {}

  @ModeratorGuard()
  @WithUser()
  @Post('ttt')
  public async tt(@Body() b: UpdateRolesDto) {}

}
