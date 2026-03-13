import { MessageUpdatedEvent } from "../../gateway/events/message-updated.event";

export class TicketMessageCommand {
  constructor(public readonly event: MessageUpdatedEvent) {}
}
