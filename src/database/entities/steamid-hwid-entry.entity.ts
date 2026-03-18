import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("steamid_hwid_entry")
export class SteamidHwidEntryEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "steam_id" })
  steamId: string;

  @Column({ name: "hwid" })
  hwid: string;

  @CreateDateColumn({ type: "timestamptz", name: "created_at" })
  createdAt: Date;
}