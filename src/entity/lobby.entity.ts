import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { LobbySlotEntity } from "./lobby-slot.entity";
import { Dota_GameMode } from "../gateway/shared-types/dota-game-mode";
import { Dota_Map } from "../gateway/shared-types/dota-map";
import { DotaPatch } from "../gateway/constants/patch";
import { Region } from "../gateway/shared-types/region";

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

  @Column({ default: Dota_Map.DOTA })
  public map: Dota_Map;

  @Column({ name: "name", type: "text", default: "Лобби" })
  public name: string;

  @Column({ name: "password", nullable: true, type: "text" })
  public password?: string;

  @Column({ name: "fill_bots", default: false })
  public fillBots: boolean;

  @Column({ name: "enable_cheats", default: false })
  public enableCheats: boolean;

  @Column({
    name: "patch",
    default: DotaPatch.DOTA_684,
    enum: DotaPatch,
    type: "enum",
  })
  public patch: DotaPatch;

  @Column({
    name: "region",
    default: Region.RU_MOSCOW,
    enum: Region,
    type: "enum",
  })
  public region: Region;

  constructor(ownerSteamId: string) {
    this.ownerSteamId = ownerSteamId;
    this.name = "Лобби";
  }
}
