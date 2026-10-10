// Internal: a player logged in to the launcher and reported his HWID
export class LauncherHwidLoginEvent {
  constructor(
    public readonly steamId: string,
    public readonly hwid: string,
    // First login of this account from this computer
    public readonly isNewEntry: boolean,
  ) {}
}
