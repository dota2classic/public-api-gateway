import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Dota2Version } from '../gateway/shared-types/dota2version';
import { MatchmakingMode } from '../gateway/shared-types/matchmaking-mode';


@Entity()
export class MatchmakingModeStatusEntity {

  @PrimaryColumn()
  public mode: MatchmakingMode;

  @PrimaryColumn()
  public version: Dota2Version;

  @Column()
  enabled: boolean;
}
