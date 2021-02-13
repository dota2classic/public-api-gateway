export class TeamMemberDto {
  public readonly name: string;
  public readonly steam_id: string;
  public readonly avatar: string;
}
export class TeamDto {
  public readonly id: string;
  public readonly name: string;
  public readonly imageUrl: string;
  public readonly tag: string;
  public readonly members: TeamMemberDto[];
  public readonly creator: string;
  public readonly locked: boolean;
}

export class CreateTeamDto {
  public readonly name: string
  public readonly tag: string
  public readonly imageUrl: string
}



export class CompactTeamDto {
  public readonly id: string;
  public readonly name: string;
  public readonly imageUrl: string;
  public readonly tag: string;
  public readonly creator: string;
  public readonly locked: boolean;
}


export class InviteToTeamDto {
  invited: string;
}

export class TeamInvitationDto {
  team: CompactTeamDto;
  inviteId: number;
}
export class SubmitInviteDto {
  accept: boolean;
}
