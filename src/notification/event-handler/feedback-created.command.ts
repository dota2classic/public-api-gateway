import { FeedbackCreatedEvent } from "../../feedback/event/feedback-created.event";

export class FeedbackCreatedCommand {
  constructor(public readonly event: FeedbackCreatedEvent) {}
}
