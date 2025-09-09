import { MessageUpdatedEvent } from "../gateway/events/message-updated.event";

export class MessageCreatedEvent {
  constructor(public readonly event: MessageUpdatedEvent) {}
}
