import {
  Body,
  Controller,
  Get,
  Ip,
  Logger,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { SelfworkOrderNotification } from "./payments.dto";
import { PaymentService } from "./payment.service";
import { CookiesUserId } from "../../utils/decorator/current-user";
import { ConfigService } from "@nestjs/config";
import { CookieUserGuard } from "../../utils/decorator/with-user";
import { FastifyReply, FastifyRequest } from "fastify";

@Controller("payment_web_hook")
export class PaymentHooksController {
  private logger = new Logger(PaymentHooksController.name);

  constructor(
    private readonly payment: PaymentService,
    private readonly config: ConfigService,
  ) {}

  // Selfwork

  // Selfwork
  @Post("selfwork_callback")
  public async selfworkCallbackHook(
    @Ip() ip: string,
    @Body() dto: SelfworkOrderNotification,
  ) {
    console.log(dto);
    const payment = await this.payment.validateNotification(dto);
    if (!payment) {
      throw "Invalid payment";
    }

    this.logger.log(`Received valid payment update ${dto}`, payment);

    if (payment.status === "succeeded") {
      await this.payment.onPaymentSucceeded(payment);
    } else {
      this.logger.warn("Unknown payment status " + payment.status);
    }
  }

  @UseGuards(CookieUserGuard)
  @Get("finish")
  public async finishSelfworkPayment(
    @CookiesUserId() steamId: string,
    @Res() res: FastifyReply,
    @Req() req: FastifyRequest,
    @Query("id") orderId: string,
  ) {
    // const isSuccess = "success" in req.query;
    // const isError = "error" in req.query;
    console.log(
      "finishSelfworkPayment!",
      // isSuccess,
      // isError,
      req.query,
      orderId,
      steamId,
    );
    res.redirect(`${this.config.get("api.frontUrl")}/players/${steamId}`, 302);
  }

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
