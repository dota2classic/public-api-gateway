import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("player_flags")
export class PlayerFlagsEntity {
  @PrimaryColumn({
    name: "steam_id",
  })
  steamId: string;

  @Column({
    name: "ignore_smurf_alert",
    type: "boolean",
  })
  ignoreSmurf: boolean;
}
