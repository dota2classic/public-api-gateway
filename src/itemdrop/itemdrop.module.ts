import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ItemDropController } from "./item-drop.controller";
import { ItemDropMapper } from "./item-drop.mapper";
import { ItemDropService } from "./item-drop.service";
import { ItemDroppedHandler } from "./item-dropped.handler";
import { SubscriptionProductEntity } from "../entity/subscription-product.entity";
import { NotificationModule } from "../notification/notification.module";
import { PaymentsModule } from "../payments/payments.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionProductEntity]),
    NotificationModule,
    PaymentsModule,
  ],
  controllers: [ItemDropController],
  providers: [ItemDropMapper, ItemDropService, ItemDroppedHandler],
  exports: [ItemDropService],
})
export class ItemDropModule {}
