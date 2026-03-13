import { UserDTO } from "../../../shared.dto";

export class PartyInviteReceivedMessageS2C {
  constructor(
    public readonly partyId: string,
    public readonly inviteId: string,
    public readonly inviter: UserDTO,
  ) {}
}
