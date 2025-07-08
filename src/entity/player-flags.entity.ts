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

  @Column({
    name: "disable_reports",
    type: "boolean",
    default: false,
  })
  disableReports: boolean;

  @Column({
    name: "disable_streams",
    type: "boolean",
    default: false,
  })
  disableStreams: boolean;
}
