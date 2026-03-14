import { Column, Entity, PrimaryColumn } from "typeorm";
import { SubscriptionDto } from "../../notification/notification.dto";

@Entity()
export class WebpushSubscriptionEntity {
  @PrimaryColumn()
  public steam_id: string;

  @Column({ type: "simple-json" })
  public subscription: SubscriptionDto;
}
