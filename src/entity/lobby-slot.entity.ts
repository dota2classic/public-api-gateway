import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Relation,
} from "typeorm";
import { LobbyEntity } from "./lobby.entity";
import { DotaTeam } from "../gateway/shared-types/dota-team";

@Entity()
export class LobbySlotEntity {
  @PrimaryColumn({ name: "lobby_id", type: "uuid" })
  lobbyId: string;

  @PrimaryColumn({ name: "steam_id" })
  steamId: string;

  @Column({ nullable: true })
  team?: DotaTeam;

  @ManyToOne((type) => LobbyEntity)
  @JoinColumn([
    {
      name: "lobby_id",
      referencedColumnName: "id",
    },
  ])
  lobby: Relation<LobbySlotEntity>;

  constructor(lobbyId: string, steamId: string) {
    this.lobbyId = lobbyId;
    this.steamId = steamId;
  }
}
