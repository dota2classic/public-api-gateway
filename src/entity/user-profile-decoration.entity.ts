import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { UserProfileDecorationPreferencesEntity } from "./user-profile-decoration-preferences.entity";

export enum UserProfileDecorationType {
  HAT = "HAT",
}

@Entity("user_profile_decoration")
export class UserProfileDecorationEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    name: "decoration_type",
    type: "enum",
    enum: UserProfileDecorationType,
    enumName: "user_profile_decoration_type",
  })
  decorationType: UserProfileDecorationType;

  @Column({
    name: "image_key",
  })
  imageKey: string;

  @OneToMany(() => UserProfileDecorationPreferencesEntity, (t) => t.hat)
  hatWearer: Relation<UserProfileDecorationPreferencesEntity>[];
}
