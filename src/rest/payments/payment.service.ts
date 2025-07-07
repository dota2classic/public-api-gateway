import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApisauceInstance, create } from "apisauce";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import {
  SelfCreatePaymentDto,
  SelfworkOrderNotification,
} from "./payments.dto";
import {
  PaymentStatus,
  UserPaymentEntity,
} from "../../entity/user-payment.entity";
import { UserSubscriptionPaidEvent } from "../../gateway/events/user/user-subscription-paid.event";
import { SubscriptionProductEntity } from "../../entity/subscription-product.entity";
import { NotificationService } from "../notification/notification.service";
import {
  NotificationEntityType,
  NotificationType,
} from "../../entity/notification.entity";
import * as crypto from "crypto";
import { PayanywayPaymentAdapter } from "./payanyway-payment-adapter";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";

@Injectable()
export class PaymentService {
  public static DAYS_IN_MONTH = 30;
  private logger = new Logger(PaymentService.name);

  private api: ApisauceInstance;

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(UserPaymentEntity)
    private readonly userPaymentEntityRepository: Repository<UserPaymentEntity>,
    @InjectRepository(SubscriptionProductEntity)
    private readonly subscriptionProductEntityRepository: Repository<SubscriptionProductEntity>,
    private readonly dataSource: DataSource,
    private readonly notification: NotificationService,
    private readonly payanywayAdapter: PayanywayPaymentAdapter,
    private readonly amqpConnection: AmqpConnection,
  ) {
    const token = btoa(
      `${config.get("selfwork.shopId")}:${config.get("selfwork.token")}`,
    );
    this.api = create({
      baseURL: "https://pro.selfwork.ru/merchant/v1",
      headers: {
        Authorization: `Basic ${token}`,
      },
    });
  }

  public async validateSignature(notification: SelfworkOrderNotification) {
    const raw = `${notification.order_id}${notification.amount}${this.config.get("selfwork.token")}`;
    const sha256 = crypto.createHash("sha256").update(raw).digest("hex");
    if (notification.signature !== sha256) {
      throw "Invalid signature!";
    }
  }

  public async validateNotification(
    notification: SelfworkOrderNotification,
  ): Promise<SelfworkOrderNotification> {
    const payment = await this.api.get<SelfworkOrderNotification>(
      `/status?order_id=${notification.order_id}`,
    );
    if (!payment.ok) {
      this.logger.log(
        "There was an issue querying selfwork API",
        payment.originalError,
      );
      return undefined;
    }

    if (payment.data.status !== notification.status) {
      this.logger.log("Status are different for payments!", {
        actual: payment.data.status,
        received: notification.status,
      });
      return undefined;
    }

    return payment.data;
  }

  public async createPayment(steamId: string, productId: number) {
    const product =
      await this.subscriptionProductEntityRepository.findOneOrFail({
        where: {
          id: productId,
        },
      });

    return await this.userPaymentEntityRepository.save(
      new UserPaymentEntity(
        steamId,
        "email",
        product.price,
        product.id,
        PaymentStatus.CREATED,
      ),
    );
  }

  public async createPaymentSelfwork(
    steamId: string,
    productId: number,
  ): Promise<
    { internal: UserPaymentEntity; external: SelfCreatePaymentDto } | undefined
  > {
    const product =
      await this.subscriptionProductEntityRepository.findOneOrFail({
        where: {
          id: productId,
        },
      });

    let internalPayment = new UserPaymentEntity(
      steamId,
      "email",
      product.price,
      product.id,
      PaymentStatus.CREATED,
    );
    internalPayment =
      await this.userPaymentEntityRepository.save(internalPayment);
    await this.userPaymentEntityRepository.update(
      { id: internalPayment.id },
      { paymentId: internalPayment.id, status: PaymentStatus.CREATED },
    );

    const fullPrice = product.price * product.months * 100;

    const request = {
      amount: fullPrice,
      order_id: internalPayment.id,
      info: [
        {
          name: `Покупка подписки dotaclassic plus`,
          quantity: 1,
          amount: fullPrice,
        },
      ],
      signature: "",
    } satisfies SelfCreatePaymentDto;

    const raw = [
      request.order_id,
      request.amount,
      ...request.info.flatMap((t) => [t.name, t.quantity, t.amount]),
      this.config.get("selfwork.token"),
    ].join(``);
    request.signature = crypto.createHash("sha256").update(raw).digest("hex");

    return {
      internal: internalPayment,
      external: request,
    };
  }

  public async findByExternalId(id: string) {
    return this.userPaymentEntityRepository.findOne({
      where: {
        paymentId: id,
      },
    });
  }

  // public async onPaymentSucceeded(transactionId: string) {
  //   // if (externalPayment.status !== "succeeded") {
  //   //   this.logger.log("Tried to handle not succeeded payment");
  //   //   throw "Bad status";
  //   // }
  //
  //   if (
  //     await this.userPaymentEntityRepository.exists({
  //       where: { paymentId: transactionId },
  //     })
  //   ) {
  //     throw "Already processed";
  //   }
  //   await this.dataSource.transaction(async (tx) => {
  //     const payment = await tx
  //       .createQueryBuilder<UserPaymentEntity>(UserPaymentEntity, "payment")
  //       .useTransaction(true)
  //       .setLock("pessimistic_write")
  //       .where("payment.payment_id = :id", { id: transactionId })
  //       .getOne();
  //
  //     if (payment.status == PaymentStatus.SUCCEEDED) {
  //       this.logger.log("Tried to handle payment success twice", {
  //         external_payment_id: transactionId,
  //         payment_id: payment.id,
  //       });
  //       return;
  //     }
  //
  //     const product = await tx.findOne<SubscriptionProductEntity>(
  //       SubscriptionProductEntity,
  //       {
  //         where: {
  //           id: payment.productId,
  //         },
  //       },
  //     );
  //
  //     payment.status = PaymentStatus.SUCCEEDED;
  //     await tx.save(payment);
  //     this.logger.log("Updated payment status to succeeded", {
  //       id: payment.id,
  //       external_payment_id: transactionId,
  //     });
  //     // here we also need to add role
  //
  //     await this.notification.createNotification(
  //       payment.steamId,
  //       payment.steamId,
  //       NotificationEntityType.PLAYER,
  //       NotificationType.SUBSCRIPTION_PURCHASED,
  //       "700days",
  //     );
  //
  //     const result = await this.rmq
  //       .send<boolean>(
  //         UserSubscriptionPaidEvent.name,
  //         new UserSubscriptionPaidEvent(
  //           payment.steamId,
  //           product.months * PaymentService.DAYS_IN_MONTH,
  //         ), // For now
  //       )
  //       .toPromise();
  //     this.logger.log("Successfully awaited result of add days command", {
  //       result,
  //     });
  //   });
  // }

  public async handleSuccessfulPayment(
    paymentId: string,
    externalPaymentId: string,
  ) {
    await this.dataSource.transaction(async (tx) => {
      const payment = await tx
        .createQueryBuilder<UserPaymentEntity>(UserPaymentEntity, "payment")
        .useTransaction(true)
        .setLock("pessimistic_write")
        .where("payment.id = :id", { id: paymentId })
        .getOne();

      if (payment.status == PaymentStatus.SUCCEEDED) {
        this.logger.log("Tried to handle payment success twice", {
          external_payment_id: externalPaymentId,
          payment_id: payment.id,
        });
        return;
      }

      const product = await tx.findOne<SubscriptionProductEntity>(
        SubscriptionProductEntity,
        {
          where: {
            id: payment.productId,
          },
        },
      );

      payment.status = PaymentStatus.SUCCEEDED;
      payment.paymentId = externalPaymentId;
      await tx.save(payment);
      this.logger.log("Updated payment status to succeeded", {
        id: payment.id,
        external_payment_id: externalPaymentId,
      });
      // here we also need to add role

      await this.notification.createNotification(
        payment.steamId,
        payment.steamId,
        NotificationEntityType.PLAYER,
        NotificationType.SUBSCRIPTION_PURCHASED,
        "700days",
      );

      await this.amqpConnection.publish(
        "app.events",
        UserSubscriptionPaidEvent.name,
        new UserSubscriptionPaidEvent(
          payment.steamId,
          product.months * PaymentService.DAYS_IN_MONTH,
        ),
      );
      this.logger.log("Successfully awaited result of add days command");
    });
  }
}
