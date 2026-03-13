import { IsEmail } from "class-validator";

export class CreatePaymentItemDto {
  name: string;
  quantity: number;
  amount: number;
}
export class SelfCreatePaymentDto {
  amount: number;
  order_id: string;
  info: CreatePaymentItemDto[];
  signature: string;
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

export interface SelfworkOrderNotification {
  order_id: string; // ID заказа
  status: "succeeded" | string; // Статус
  amount: number; // Сумма (в копейках)
  currency: string; // Валюта
  created_at: number; // Время создания операции (Timestamp)
  finish_at: number; // Время завершения операции (Timestamp)
  info: {
    name: string; // Название товара
    quantity: number; // Количество товара
    amount: number; // Стоимость товара (в копейках)
  }[];
  payment_method: {
    type: string; // Тип платежного метода
    pan: string; // Номер банковской карты (маскированный)
  };
  signature: string; // Подпись уведомления
}

export class SimulatePaymentDto {
  productId: number;
  steamId: string;
  paymentId: string;
}
