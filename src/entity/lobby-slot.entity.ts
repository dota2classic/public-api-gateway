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
  @Column({ name: "lobby_id", type: "uuid" })
  lobbyId: string;

  @PrimaryColumn({ name: "steam_id", unique: true })
  steamId: string;

  @Column({ nullable: true })
  team?: DotaTeam;

  @Column({ name: "index_in_team", default: 0 })
  indexInTeam: number;

  @ManyToOne((type) => LobbyEntity)
  @JoinColumn([
    {
      name: "lobby_id",
      referencedColumnName: "id",
    },
  ])
  lobby: Relation<LobbySlotEntity>;

  constructor(lobbyId: string, steamId: string, index: number) {
    this.lobbyId = lobbyId;
    this.steamId = steamId;
    this.indexInTeam = index;
  }
}
