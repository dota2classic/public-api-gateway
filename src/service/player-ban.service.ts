import { Injectable } from "@nestjs/common";
import { PlayerApi } from "../generated-api/gameserver";

export enum BanLevel {
  NONE,
  TEMPORAL,
  PERMANENT,
}

@Injectable()
export class PlayerBanService {
  constructor(private readonly playerApi: PlayerApi) {}

  public async getBanStatus(steamId: string) {
    const bi = await this.playerApi.playerControllerBanInfo(steamId);
    // More than 365 days = perma ban
    if (
      new Date(bi.bannedUntil) >=
      new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
    )
      return BanLevel.PERMANENT;
    return bi.isBanned ? BanLevel.TEMPORAL : BanLevel.NONE;
  }

  public async assertNotBanned(
    steamId: string,
    banLevel: BanLevel,
    errorMessage: string = "Игрок заблокирован",
  ) {
    const banStatus = await this.getBanStatus(steamId);
    if (banStatus >= banLevel) throw new Error(errorMessage);
  }
}
