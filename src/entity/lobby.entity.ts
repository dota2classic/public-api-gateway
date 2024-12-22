import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { LobbySlotEntity } from "./lobby-slot.entity";
import { Dota_GameMode } from "../gateway/shared-types/dota-game-mode";

@Entity()
export class LobbyEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @OneToMany((type) => LobbySlotEntity, (t) => t.lobby, { eager: true })
  public slots: LobbySlotEntity[];

  @Column({ default: Dota_GameMode.ALLPICK })
  public gameMode: Dota_GameMode;
}
