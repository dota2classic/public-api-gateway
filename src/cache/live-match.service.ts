import { Injectable } from '@nestjs/common';
import { LiveMatchDto } from '../rest/match/dto/match.dto';

@Injectable()
export class LiveMatchService {

  // matchID key
  public cache = new Map<number, LiveMatchDto>()

}
