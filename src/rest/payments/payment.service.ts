import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApisauceInstance, create } from "apisauce";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import {
  CreatedYoukassaPayment,
  YCreatePaymentDto,
  YoukassaPayment,
  YoukassaWebhookNotification,
} from "./payments.dto";
import {
  PaymentStatus,
  UserPaymentEntity,
} from "../../entity/user-payment.entity";
import { UserSubscriptionPaidEvent } from "../../gateway/events/user/user-subscription-paid.event";
import { ClientProxy } from "@nestjs/microservices";
import { SubscriptionProductEntity } from "../../entity/subscription-product.entity";

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
    @Inject("RMQ") private readonly rmq: ClientProxy,
  ) {
    const token = btoa(
      `${config.get("youkassa.shopId")}:${config.get("youkassa.token")}`,
    );
    this.api = create({
      baseURL: "https://api.yookassa.ru/v3/payments",
      headers: {
        Authorization: `Basic ${token}`,
      },
    });
  }

  public async validateNotification(
    notification: YoukassaWebhookNotification,
  ): Promise<YoukassaPayment> {
    const payment = await this.api.get<YoukassaPayment>(
      `/${notification.object.id}`,
    );
    if (!payment.ok) {
      console.warn(payment.originalError);
      return undefined;
    }

    if (payment.data.status !== notification.object.status) {
      console.log(payment.data);
      return undefined;
    }

    return payment.data;
  }

  public async createPayment(
    steamId: string,
    productId: number,
  ): Promise<
    | { internal: UserPaymentEntity; external: CreatedYoukassaPayment }
    | undefined
  > {
    const product =
      await this.subscriptionProductEntityRepository.findOneOrFail({
        where: {
          id: productId,
        },
      });

    let internalPayment = await this.userPaymentEntityRepository.save(
      new UserPaymentEntity(
        steamId,
        product.price,
        product.id,
        PaymentStatus.CREATED,
      ),
    );

    const createdPayment = await this.api.post<CreatedYoukassaPayment>(
      "",
      {
        amount: {
          currency: "RUB",
          value: `${product.price * product.months}.00`,
        },
        confirmation: {
          type: "redirect",
          return_url: `${this.config.get("api.backUrl")}/v1/payment_web_hook/redirect`,
        },
        capture: true,
        description: "Покупка подписки dotaclassic plus",
      } satisfies YCreatePaymentDto,
      {
        headers: {
          "Idempotence-Key": internalPayment.id,
        } as any,
      },
    );

    if (!createdPayment.ok) {
      this.logger.log(
        "There was an issue creating external payment",
        createdPayment.originalError,
      );
      console.error(createdPayment.originalError);
      await this.userPaymentEntityRepository.update(
        {
          id: internalPayment.id,
        },
        {
          status: PaymentStatus.FAILED,
        },
      );
      return undefined;
    }

    await this.userPaymentEntityRepository.update(
      {
        id: internalPayment.id,
      },
      {
        status: PaymentStatus.IN_PROGRESS,
        paymentId: createdPayment.data.id,
      },
    );

    internalPayment = await this.userPaymentEntityRepository.findOne({
      where: { id: internalPayment.id },
    });

    return {
      internal: internalPayment,
      external: createdPayment.data,
    };
  }

  public async findByExternalId(id: string) {
    return this.userPaymentEntityRepository.findOne({
      where: {
        paymentId: id,
      },
    });
  }

  public async onPaymentSucceeded(externalPayment: YoukassaPayment) {
    if (externalPayment.status !== "succeeded") {
      this.logger.log("Tried to handle not succeeded payment");
      throw "Bad status";
    }
    await this.dataSource.transaction(async (tx) => {
      const payment = await tx
        .createQueryBuilder<UserPaymentEntity>(UserPaymentEntity, "payment")
        .leftJoinAndMapOne("product", SubscriptionProductEntity, "product")
        .useTransaction(true)
        .setLock("pessimistic_write")
        .where("payment.payment_id = :id", { id: externalPayment.id })
        .getOne();

      if (payment.status == PaymentStatus.SUCCEEDED) {
        this.logger.log("Tried to handle payment success twice", {
          external_payment_id: externalPayment.id,
          payment_id: payment.id,
        });
        return;
      }

      console.log(payment.product);

      payment.status = PaymentStatus.SUCCEEDED;
      await tx.save(payment);
      this.logger.log("Updated payment status to succeeded", {
        id: payment.id,
        external_payment_id: externalPayment.id,
      });
      // here we also need to add role

      const result = await this.rmq
        .send<boolean>(
          UserSubscriptionPaidEvent.name,
          new UserSubscriptionPaidEvent(
            payment.steamId,
            payment.product.months * PaymentService.DAYS_IN_MONTH,
          ), // For now
        )
        .toPromise();
      this.logger.log("Successfully awaited result of add days command", {
        result,
      });
    });
  }
}
