export class FeedbackCreatedEvent {
  constructor(
    public readonly playerFeedbackId: number,
    public readonly steamId: string
  ) {
  }
}
