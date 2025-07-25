import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PaymentService } from "./payment.service";
import { AdminGuard, WithUser } from "../../utils/decorator/with-user";
import {
  CurrentUser,
  CurrentUserDto,
} from "../../utils/decorator/current-user";
import { SimulatePaymentDto, SubscriptionProductDto } from "./payments.dto";
import { SubscriptionProductEntity } from "../../entity/subscription-product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Controller("user_payment")
@ApiTags("user_payment")
export class UserPaymentsController {
  constructor(
    private readonly paymentService: PaymentService,
    @InjectRepository(SubscriptionProductEntity)
    private readonly subscriptionProductEntityRepository: Repository<SubscriptionProductEntity>,
  ) {}

  @AdminGuard()
  @WithUser()
  @Post("record_payment")
  public async simulatePayment(
    @CurrentUser() user: CurrentUserDto,
    @Body() dto: SimulatePaymentDto,
  ) {
    const payment = await this.paymentService.createPayment(
      dto.steamId,
      dto.productId,
    );
    await this.paymentService.handleSuccessfulPayment(
      payment.id,
      dto.paymentId,
    );
  }

  // @WithUser()
  // @Post()
  // public async createPayment(
  //   @CurrentUser() user: CurrentUserDto,
  //   @Body() dto: CreatePaymentDto,
  // ): Promise<string> {
  //   const p = await this.paymentService.createPayment(
  //     user.steam_id,
  //     dto.productId,
  //   );
  //   if (!p) {
  //     throw "Something went wrong";
  //   }
  //
  //   return p.paymentUrl;
  // }

  @Get("/products")
  public async getProducts(): Promise<SubscriptionProductDto[]> {
    const products = await this.subscriptionProductEntityRepository.find();
    const mostExpensive = products.sort((a, b) => b.price - a.price)[0];
    return products.map((it) => ({
      id: it.id,
      months: it.months,
      pricePerMonth: it.price,
      discount: 1 - it.price / mostExpensive.price,
    }));
  }
}
