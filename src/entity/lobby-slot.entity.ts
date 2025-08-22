import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { LobbyEntity } from "./lobby.entity";
import { DotaTeam } from "../gateway/shared-types/dota-team";

@Entity("lobby_slot_entity")
@Index(
  "PK_lobby_slot_unique_lobby_team_index",
  ["lobbyId", "indexInTeam", "team"],
  { unique: true },
)
export class LobbySlotEntity {
  @PrimaryGeneratedColumn("increment")
  readonly id: number;

  @Column({ name: "lobby_id", type: "uuid" })
  readonly lobbyId: string;

  @Column({ name: "index_in_team", default: 0 })
  readonly indexInTeam: number;

  @Column({ nullable: true })
  readonly team?: DotaTeam;

  @Column({ name: "steam_id", nullable: true })
  steamId: string;

  @ManyToOne((type) => LobbyEntity)
  @JoinColumn([
    {
      name: "lobby_id",
      referencedColumnName: "id",
    },
  ])
  lobby: Relation<LobbySlotEntity>;

  constructor(
    lobbyId: string,
    team: DotaTeam | undefined,
    index: number,
    steamId = undefined,
  ) {
    this.lobbyId = lobbyId;
    this.team = team;
    this.indexInTeam = index;
    this.steamId = steamId;
  }
}
