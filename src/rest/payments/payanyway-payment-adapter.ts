import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UserPaymentEntity } from "../../entity/user-payment.entity";
import { SubscriptionProductEntity } from "../../entity/subscription-product.entity";
import { pluralize } from "../../utils/pluralize";
import * as qs from "qs";
import * as crypto from "crypto";

@Injectable()
export class PayanywayPaymentAdapter {
  private readonly shopId: string;
  private readonly signatureKey: string;

  constructor(private readonly config: ConfigService) {
    this.shopId = config.get("payanyway.shopId");
    this.signatureKey = config.get("payanyway.signatureKey");
  }

  public async createPayment(
    payment: UserPaymentEntity,
    product: SubscriptionProductEntity,
  ): Promise<string> {
    const fullPrice = product.price * product.months;

    const args = {
      MNT_ID: this.shopId,
      MNT_AMOUNT: fullPrice + ".00",
      MNT_TRANSACTION_ID: payment.id,
      MNT_DESCRIPTION: `Покупка подписки dotaclassic plus на ${product.months} ${pluralize(product.months, "месяц", "месяца", "месяцев")}`,
      MNT_SUBSCRIBER_ID: payment.steamId,
      MNT_CURRENCY_CODE: "RUB",
      MNT_SIGNATURE: "",
    };

    args.MNT_SIGNATURE = this.createSignature(
      args.MNT_ID,
      args.MNT_TRANSACTION_ID,
      args.MNT_AMOUNT,
      args.MNT_CURRENCY_CODE,
      args.MNT_SUBSCRIBER_ID,
    );

    const strArgs = qs.stringify(args);

    return `https://moneta.ru/assistant.widget?${strArgs}`;
  }

  public async validatePaymentStatus(
    mntId: string,
    mntTransactionId: string,
    mntOperationId: string,
    mntAmount: string,
    mntCurrencyCode: string,
    mntSubscriberId: string,
    mntTestMode: string,
    mntSignature: string,
    mntUser: string,
  ): Promise<string> {
    const expectedSignature = this.createSignatureFromArray(
      mntId,
      mntTransactionId,
      mntOperationId,
      mntAmount,
      mntCurrencyCode,
      mntSubscriberId,
      mntTestMode,
    );
    console.log("Expected signature", expectedSignature);
    console.log("Actual signature", mntSignature);

    return mntOperationId;
  }

  private createSignatureFromArray(...args: unknown[]) {
    const raw = [...args, this.signatureKey].join("");
    return crypto.createHash("md5").update(raw).digest("hex");
  }

  private createSignature(
    id: string,
    transactionId: string,
    amount: string,
    currency: string,
    subscriberId: string,
    isTest: boolean = false,
  ) {
    return this.createSignatureFromArray([
      id,
      transactionId,
      amount,
      currency,
      subscriberId,
      isTest ? "1" : "0",
    ]);
  }
}
