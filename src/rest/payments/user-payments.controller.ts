import { Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PaymentService } from "./payment.service";
import { WithUser } from "../../utils/decorator/with-user";
import {
  CurrentUser,
  CurrentUserDto,
} from "../../utils/decorator/current-user";
import { StartPaymentDto } from "./payments.dto";

@Controller("user_payment")
@ApiTags("user_payment")
export class UserPaymentsController {
  constructor(private readonly paymentService: PaymentService) {}

  @WithUser()
  @Post()
  public async createPayment(
    @CurrentUser() user: CurrentUserDto,
  ): Promise<StartPaymentDto> {
    const p = await this.paymentService.createPayment(user.steam_id, 100);
    if (!p) {
      throw "Something went wrong";
    }

    return {
      confirmationUrl: p.external.confirmation.confirmation_url,
    };
  }
}
