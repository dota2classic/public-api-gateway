import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { UserPaymentEntity } from "./user-payment.entity";

@Entity("subscription_product")
export class SubscriptionProductEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    name: "months",
  })
  months: number;

  @Column({
    name: "price",
    type: "int",
  })
  price: number;

  @OneToMany(() => UserPaymentEntity, (t) => t.product)
  purchases: Relation<UserPaymentEntity>[];
}
