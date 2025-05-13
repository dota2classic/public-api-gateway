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
  hatId?: number;

  @ManyToOne(() => UserProfileDecorationEntity, (t) => t.iconWearer, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({
    referencedColumnName: "id",
    name: "icon_id",
  })
  icon: Relation<UserProfileDecorationEntity>;

  @Column({
    name: "icon_id",
    nullable: true,
  })
  iconId?: number;

  @ManyToOne(() => UserProfileDecorationEntity, (t) => t.titleWearer, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({
    referencedColumnName: "id",
    name: "title_id",
  })
  title: Relation<UserProfileDecorationEntity>;

  @Column({
    name: "title_id",
    nullable: true,
  })
  titleId?: number;

  @ManyToOne(() => UserProfileDecorationEntity, (t) => t.animationWearer, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({
    referencedColumnName: "id",
    name: "animation_id",
  })
  animation: Relation<UserProfileDecorationEntity>;

  @Column({
    name: "animation_id",
    nullable: true,
  })
  animationId?: number;
}
