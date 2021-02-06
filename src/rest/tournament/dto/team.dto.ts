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
}
