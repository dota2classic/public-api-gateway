import { PlayerFeedbackCreatedEvent } from "../../gateway/events/player-feedback-created.event";

export class PlayerFeedbackCreatedCommand {
  constructor(public readonly event: PlayerFeedbackCreatedEvent) {}
}
