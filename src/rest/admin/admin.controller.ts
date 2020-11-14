import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { MatchDto } from '../match/dto/match.dto';
import { EventBus } from '@nestjs/cqrs';
import { construct } from '../../gateway/util/construct';
import { EventAdminDto } from './dto/admin.dto';
import { ClientProxy } from '@nestjs/microservices';

@Controller('admin')
export class AdminController {
  constructor(
    @Inject('QueryCore') private readonly redisEventQueue: ClientProxy,
  ) {}
  @Post('/debug_event')
  async match(@Body() b: EventAdminDto) {
    this.redisEventQueue.emit(b.name, b.body);
  }
}
