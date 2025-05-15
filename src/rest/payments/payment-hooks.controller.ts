import {
  Body,
  Controller,
  Get,
  Ip,
  Logger,
  NotFoundException,
  Post,
} from "@nestjs/common";

import { YoukassaWebhookNotification } from "./payments.dto";
import { PaymentService } from "./payment.service";

@Controller("payment_web_hook")
export class PaymentHooksController {
  private logger = new Logger(PaymentHooksController.name);

  constructor(private readonly payment: PaymentService) {}

  @Post()
  public async youkassaNotificationWebhook(
    @Ip() ip: string,
    @Body() dto: YoukassaWebhookNotification,
  ) {
    const payment = await this.payment.validateNotification(dto);
    if (!payment) {
      throw "Invalid payment";
    }

    this.logger.log(`Received valid payment update ${dto.event}`, payment);

    if (payment.status == "waiting_for_capture") {
      // Need to confirm with 200
      const p = await this.payment.findByExternalId(payment.id);
      if (!p) {
        throw new NotFoundException("Payment not found");
      }
    } else if (payment.status === "succeeded") {
      await this.payment.onPaymentSucceeded(payment);
    }
  }

  @Get("redirect")
  public async redirect() {
    this.logger.log("I received redirect from somehwere");
  }
}
