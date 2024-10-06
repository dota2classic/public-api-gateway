import { ApiProperty } from '@nestjs/swagger';
import { AchievementKey } from '../../../gateway/shared-types/achievemen-key';
import { MatchDto } from '../../match/dto/match.dto';
import { UserDTO } from '../../shared.dto';

export class AchievementDto {
  @ApiProperty({ enum: AchievementKey, enumName: 'AchievementKey' })
  key: AchievementKey;

  user: UserDTO;

  maxProgress: number;
  progress: number;

  isComplete: boolean;
  match?: MatchDto;
}
