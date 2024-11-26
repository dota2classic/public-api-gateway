import { PartyInviteReceivedMessageS2C } from "./party-invite-received-message.s2c";

export class PlayerPartyInvitationsMessageS2C {
  constructor(public readonly invitations: PartyInviteReceivedMessageS2C[]) {}
}
