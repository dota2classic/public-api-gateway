import { ApiProperty } from "@nestjs/swagger";
import { AchievementKey } from "../../../gateway/shared-types/achievemen-key";
import { UserDTO } from "../../shared.dto";

export class AchievementDto {
  @ApiProperty({ enum: AchievementKey, enumName: "AchievementKey" })
  key: AchievementKey;

  user: UserDTO;

  checkpoints: number[];
  progress: number;
  percentile: number;

  isComplete: boolean;
  matchId?: number;
}
