import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { NotificationService } from "../notification.service";
import {
  NotificationEntityType,
  NotificationType,
} from "../../entity/notification.entity";
import { TradeOfferExpiredCommand } from "./trade-offer-expired.command";

@CommandHandler(TradeOfferExpiredCommand)
export class TradeOfferExpiredHandler
  implements ICommandHandler<TradeOfferExpiredCommand>
{
  constructor(private readonly notification: NotificationService) {}

  async execute({ event }: TradeOfferExpiredCommand) {
    await this.notification.createNotification(
      event.steamId,
      event.steamId,
      NotificationEntityType.PLAYER,
      NotificationType.TRADE_OFFER_EXPIRED,
    );
  }
}
