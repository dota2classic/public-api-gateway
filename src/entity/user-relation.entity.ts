import { Column, Entity, PrimaryColumn } from "typeorm";
import { UserRelationStatus } from "../gateway/shared-types/user-relation";

@Entity("user_relation")
export class UserRelationEntity {
  @PrimaryColumn({
    name: "steam_id",
  })
  steamId: string;

  @PrimaryColumn({
    name: "related_steam_id",
  })
  relatedSteamId: string;

  @Column({
    name: "relation",
    type: "enum",
    enum: UserRelationStatus,
    enumName: "user_relation_status",
  })
  relation: UserRelationStatus;
}
