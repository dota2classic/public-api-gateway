export class PlayerFeedbackThreadCreatedEvent {
  constructor(
    public readonly threadId: string,
    public readonly steamId: string,
    public readonly title: string,
  ) {}
}
