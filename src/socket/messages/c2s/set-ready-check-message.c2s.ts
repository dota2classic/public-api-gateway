export class SetReadyCheckMessageC2S {
  constructor(public readonly roomId: string, public readonly accept: boolean) {
  }
}
