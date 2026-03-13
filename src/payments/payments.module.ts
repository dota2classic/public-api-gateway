import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentService } from "./payment.service";
import { PaymentHooksController } from "./payment-hooks.controller";
import { UserPaymentsController } from "./user-payments.controller";
import { PayanywayPaymentAdapter } from "./payanyway-payment-adapter";
import { UserPaymentEntity } from "../entity/user-payment.entity";
import { SubscriptionProductEntity } from "../entity/subscription-product.entity";
import { NotificationModule } from "../notification/notification.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserPaymentEntity, SubscriptionProductEntity]),
    NotificationModule,
  ],
  controllers: [PaymentHooksController, UserPaymentsController],
  providers: [PaymentService, PayanywayPaymentAdapter],
  exports: [PaymentService],
})
export class PaymentsModule {}
