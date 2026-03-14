import { Column, Entity, PrimaryColumn } from "typeorm";
import { BanReason } from "gateway/shared-types/ban";

@Entity("player_ban")
export class PlayerBanEntity {
  @PrimaryColumn({
    name: "steam_id",
  })
  steamId: string;

  @Column({ type: "timestamptz", name: "end_time" })
  endTime: Date;

  @Column()
  reason: BanReason;

  constructor(steamId: string, endTime: Date, reason: BanReason) {
    this.steamId = steamId;
    this.endTime = endTime;
    this.reason = reason;
  }
}
