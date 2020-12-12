import { Controller, Get, Param } from '@nestjs/common';
import { LiveMatchService } from '../../cache/live-match.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { LiveMatchDto } from './dto/match.dto';

@Controller('live')
@ApiTags('live')
export class LiveMatchController {
  constructor(private readonly ls: LiveMatchService) {}




  @Get('/list')
  async listMatches(): Promise<LiveMatchDto[]> {
    return this.ls.list()
  }


  @ApiParam({
    name: 'id',
    required: true,
  })
  @Get('/list/:id')
  async liveMatch(@Param('id') id: number) {
    return this.ls.forId(id)
  }
}
