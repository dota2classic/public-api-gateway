import { Body, Controller, Ip, Logger, Post } from "@nestjs/common";

import { YoukassaWebhookNotification } from "./dto";

@Controller("payment_web_hook")
export class PaymentHooksController {
  private logger = new Logger(PaymentHooksController.name);

  @Post()
  public async youkassaNotificationWebhook(
    @Ip() ip: string,
    @Body() dto: YoukassaWebhookNotification,
  ) {
    this.logger.log(dto);
    this.logger.log("IP: " + ip);
  }
}
