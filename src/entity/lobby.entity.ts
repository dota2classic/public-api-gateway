import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { LobbySlotEntity } from "./lobby-slot.entity";
import { Dota_GameMode } from "../gateway/shared-types/dota-game-mode";

@Entity()
export class LobbyEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ name: "owner_steam_id" })
  public ownerSteamId: string;

  @OneToMany((type) => LobbySlotEntity, (t) => t.lobby, {
    eager: true,
    onDelete: "CASCADE",
  })
  public slots: LobbySlotEntity[];

  @Column({ default: Dota_GameMode.ALLPICK })
  public gameMode: Dota_GameMode;

  constructor(ownerSteamId: string) {
    this.ownerSteamId = ownerSteamId;
  }
}
