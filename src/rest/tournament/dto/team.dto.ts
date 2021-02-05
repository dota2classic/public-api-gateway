export class TeamMemberDto {
  public readonly name: string;
  public readonly steam_id: string;
}
export class TeamDto {
  public readonly id: string;
  public readonly name: string;
  public readonly imageUrl: string;
  public readonly tag: string;
  public readonly members: TeamMemberDto[]
}
