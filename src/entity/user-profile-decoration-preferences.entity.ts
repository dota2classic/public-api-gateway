import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Relation,
} from "typeorm";
import { UserProfileDecorationEntity } from "./user-profile-decoration.entity";

@Entity("user_profile_decoration_preferences")
export class UserProfileDecorationPreferencesEntity {
  @PrimaryColumn({
    name: "steam_id",
    unique: true,
  })
  steamId: string;

  @ManyToOne(() => UserProfileDecorationEntity, (t) => t.hatWearer, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({
    referencedColumnName: "id",
    name: "hat_id",
  })
  hat: Relation<UserProfileDecorationEntity>;

  @Column({
    name: "hat_id",
    nullable: true,
  })
  hatId: number;
}
