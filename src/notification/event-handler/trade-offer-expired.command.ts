import { TradeOfferExpiredEvent } from "../../gateway/events/trade-offer-expired.event";

export class TradeOfferExpiredCommand {
  constructor(public readonly event: TradeOfferExpiredEvent) {}
}
