import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { LiveMatchService } from '../../cache/live-match.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { LiveMatchDto } from './dto/match.dto';

@Controller('live')
@ApiTags('live')
export class LiveMatchController {
  constructor(private readonly ls: LiveMatchService) {}

  @Get('/list')
  async listMatches(): Promise<LiveMatchDto[]> {
    return this.ls.list();
  }

  @ApiParam({
    name: 'id',
    required: true,
  })
  @Get('/:id')
  async liveMatch(@Param('id', ParseIntPipe) id: number): Promise<LiveMatchDto | undefined> {
    console.log("hehhehe ;)", this.ls.forId(id), id)
    return this.ls.forId(id);
  }
}
