import { IsEmail } from "class-validator";

export interface YoukassaWebhookNotification {
  type: "notification";
  event:
    | "payment.waiting_for_capture"
    | "payment.succeeded"
    | "payment.canceled"
    | "refund.succeeded";
  object: YoukassaPayment;
}

export type YPaymentStatus =
  | "pending"
  | "waiting_for_capture"
  | "succeeded"
  | "cancelled";
export interface YoukassaPayment {
  id: string;
  status: YPaymentStatus;
  paid: boolean;
  amount: Amount;
  authorization_details: AuthorizationDetails;
  created_at: string;
  description: string;
  expires_at: string;
  metadata: Metadata;
  payment_method: PaymentMethod;
  refundable: boolean;
  test: boolean;
}

export interface CreatedYoukassaPayment extends YoukassaPayment {
  confirmation: {
    type: "redirect";
    confirmation_url: string;
  };
}

export interface Amount {
  value: string;
  currency: string;
}

export interface AuthorizationDetails {
  rrn: string;
  auth_code: string;
  three_d_secure: ThreeDSecure;
}

export interface ThreeDSecure {
  applied: boolean;
}

export interface Metadata {}

export interface PaymentMethod {
  type: string;
  id: string;
  saved: boolean;
  card: Card;
  title: string;
}

export interface Card {
  first6: string;
  last4: string;
  expiry_month: string;
  expiry_year: string;
  card_type: string;
  issuer_country: string;
  issuer_name: string;
}

export interface YCreatePaymentDto {
  amount: Amount;
  capture: boolean;
  confirmation: Confirmation;
  description: string;
}

export interface Confirmation {
  type: string;
  return_url: string;
}

export class StartPaymentDto {
  confirmationUrl: string;
}

export class SubscriptionProductDto {
  id: number;
  months: number;
  pricePerMonth: number;
  discount: number;
}

export class CreatePaymentDto {
  productId: number;
  @IsEmail()
  email: string;
}
