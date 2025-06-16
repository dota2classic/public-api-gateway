import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("maintenance")
export class MaintenanceEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    default: false,
  })
  active: boolean;
}
