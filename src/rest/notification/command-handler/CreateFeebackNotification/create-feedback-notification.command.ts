import { PlayerAspect } from "../../../../gateway/shared-types/player-aspect";

export class CreateFeedbackNotificationCommand {
  constructor(
    public readonly receiverSteamId: string,
    public readonly aspect: PlayerAspect,
    public readonly matchId: number,
  ) {}
}
