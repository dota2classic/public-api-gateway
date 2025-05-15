import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum PaymentStatus {
  CREATED = "CREATED",
  IN_PROGRESS = "IN_PROGRESS",
  FAILED = "FAILED",
  SUCCEEDED = "SUCCEEDED",
}

@Entity("user_payment")
export class UserPaymentEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    name: "steam_id",
  })
  steamId: string;

  @Column({
    type: "uuid",
    name: "payment_id",
    nullable: true,
  })
  paymentId: string;

  @Column({
    name: "amount",
    type: "int",
  })
  amount: number;

  @Column({
    enum: PaymentStatus,
    name: "status",
    enumName: "user_payment_status",
    type: "enum",
  })
  status: PaymentStatus;

  @CreateDateColumn({
    name: "created_at",
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at",
  })
  updatedAt: Date;

  constructor(steamId: string, amount: number, status: PaymentStatus) {
    this.steamId = steamId;
    this.amount = amount;
    this.status = status;
  }
}
