import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApisauceInstance, create } from "apisauce";

@Injectable()
export class PaymentService {
  private api: ApisauceInstance;

  constructor(private readonly config: ConfigService) {
    this.api = create({
      baseURL: "https://api.yookassa.ru/v3/payments",
      headers: {},
    });
  }
}
