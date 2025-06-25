import { Controller, Get, Logger, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { PaymentService } from "./payment.service";
import { CookiesUserId } from "../../utils/decorator/current-user";
import { ConfigService } from "@nestjs/config";
import { CookieUserGuard } from "../../utils/decorator/with-user";
import { ApiExcludeController } from "@nestjs/swagger";

@ApiExcludeController()
@Controller("payment_web_hook")
export class PaymentHooksController {
  private static SELFWORK_AUTHORIZED_IPS = ["178.205.169.35", "81.23.144.157"];
  private logger = new Logger(PaymentHooksController.name);

  constructor(
    private readonly payment: PaymentService,
    private readonly config: ConfigService,
  ) {}

  // payanyway_callback
  // @Get("payanyway_callback")
  // public async payanywayCallbackHook(
  //   @Query("MNT_ID") mntId: string,
  //   @Query("MNT_TRANSACTION_ID") mntTransactionId: string,
  //   @Query("MNT_OPERATION_ID") mntOperationId: string,
  //   @Query("MNT_AMOUNT") mntAmount: string,
  //   @Query("MNT_CURRENCY_CODE") mntCurrencyCode: string,
  //   @Query("MNT_SUBSCRIBER_ID") mntSubscriberId: string,
  //   @Query("MNT_TEST_MODE") mntTestMode: string,
  //   @Query("MNT_SIGNATURE") mntSignature: string,
  //   @Query("MNT_USER") mntUser: string,
  // ) {
  //   console.log(
  //     mntId,
  //     mntTransactionId,
  //     mntOperationId,
  //     mntAmount,
  //     mntCurrencyCode,
  //     mntSubscriberId,
  //     mntTestMode,
  //     mntSignature,
  //     mntUser,
  //   );
  //
  //   try {
  //     await this.payment.handlePayanywayCallback(
  //       mntId,
  //       mntTransactionId,
  //       mntOperationId,
  //       mntAmount,
  //       mntCurrencyCode,
  //       mntSubscriberId,
  //       mntTestMode,
  //       mntSignature,
  //       mntUser,
  //     );
  //     return "SUCCESS";
  //   } catch (e) {
  //     console.error(e);
  //     return "FAIL";
  //   }
  // }

  // Selfwork
  // @Post("selfwork_callback")
  // public async selfworkCallbackHook(
  //   @Ip() ip: string,
  //   @Body() dto: SelfworkOrderNotification,
  // ) {
  //   this.logger.log(`Received webhook callback from ip ${ip}`);
  //   if (!PaymentHooksController.SELFWORK_AUTHORIZED_IPS.includes(ip)) {
  //     this.logger.error("Received ip is not whitelisted!");
  //     throw "Invalid ip";
  //   }
  //
  //   await this.payment.validateSignature(dto);
  //   const payment = await this.payment.validateNotification(dto);
  //   if (!payment) {
  //     throw "Invalid payment";
  //   }
  //
  //   this.logger.log(`Received valid payment update`, {
  //     order_id: payment.order_id,
  //   });
  //
  //   if (payment.status === "succeeded") {
  //     await this.payment.onPaymentSucceeded(payment);
  //   } else {
  //     this.logger.warn("Unknown payment status " + payment.status);
  //   }
  // }

  // @UseGuards(CookieUserGuard)
  // @Get("finish")
  // public async finishSelfworkPayment(
  //   @CookiesUserId() steamId: string,
  //   @Res() res: FastifyReply,
  //   @Req() req: FastifyRequest,
  //   @Query("id") orderId: string,
  // ) {
  //   // const isSuccess = "success" in req.query;
  //   // const isError = "error" in req.query;
  //   res.redirect(`${this.config.get("api.frontUrl")}/players/${steamId}`, 302);
  // }

  // Youkasssa

  // @Post()
  // public async youkassaNotificationWebhook(
  //   @Ip() ip: string,
  //   @Body() dto: YoukassaWebhookNotification,
  // ) {
  //   const payment = await this.payment.validateNotification(dto);
  //   if (!payment) {
  //     throw "Invalid payment";
  //   }
  //
  //   this.logger.log(`Received valid payment update ${dto.event}`, payment);
  //
  //   if (payment.status == "waiting_for_capture") {
  //     // Need to confirm with 200
  //     const p = await this.payment.findByExternalId(payment.id);
  //     if (!p) {
  //       throw new NotFoundException("Payment not found");
  //     }
  //   } else if (payment.status === "succeeded") {
  //     await this.payment.onPaymentSucceeded(payment);
  //   }
  // }

  @UseGuards(CookieUserGuard)
  @Get("redirect")
  public async redirect(
    @CookiesUserId() steamId: string,
    @Res() res: Response,
  ) {
    res
      .status(302)
      .redirect(`${this.config.get("api.frontUrl")}/players/${steamId}`, 302);
  }
}
