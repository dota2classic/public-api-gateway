export class PlayerFeedbackThreadCreatedEvent {
  constructor(
    public readonly threadId: string,
    public readonly steamId: string
  ) {
  }
}
