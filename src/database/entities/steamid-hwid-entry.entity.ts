import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("steamid_hwid_entry")
export class SteamidHwidEntryEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index("IDX_steamid_hwid_entry_steam_id")
  @Column({ name: "steam_id" })
  steamId: string;

  @Index("IDX_steamid_hwid_entry_hwid")
  @Column({ name: "hwid" })
  hwid: string;

  @CreateDateColumn({ type: "timestamptz", name: "created_at" })
  createdAt: Date;
}
