export class AcceptPartyInviteMessageC2S {
  constructor(
    public readonly inviteId: string,
    public readonly accept: boolean
  ) {
  }

}
