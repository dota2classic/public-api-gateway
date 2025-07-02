export class PlayerGameStateMessageS2C {
  constructor(
    public readonly serverUrl?: string,
    public readonly matchId?: number
  ) {}
}
