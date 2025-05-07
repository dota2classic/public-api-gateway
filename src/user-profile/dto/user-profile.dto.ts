import { Role } from "../../gateway/shared-types/roles";
import { PlayerAspectDto } from "../../rest/player/dto/player.dto";
import { BanStatusDto } from "../../rest/admin/dto/admin.dto";
import { MatchAccessLevel } from "../../gateway/shared-types/match-access-level";

export interface _UserProfileDataJson {
  user: {
    id: string;
    name: string;
    avatar: string;
    roles: Role[];
  };
  reports: {
    reportsAvailable: number;
  };
  player: {
    mmr: number;
    rank: number;
    calibrationGamesLeft: number;
    accessLevel: MatchAccessLevel;

    kills: number;
    deaths: number;
    assists: number;
    playtime: number;

    win: number;
    loss: number;
    abandon: number;
    games: number;
    aspects: PlayerAspectDto[];
    ban: BanStatusDto;
  };
  forum: {};
}

export class UserProfileDto implements _UserProfileDataJson {
  forum: {};
  player: {
    mmr: number;
    rank: number;
    calibrationGamesLeft: number;
    accessLevel: MatchAccessLevel;
    win: number;
    kills: number;
    deaths: number;
    assists: number;
    loss: number;
    abandon: number;
    games: number;
    playtime: number;
    aspects: PlayerAspectDto[];
    ban: BanStatusDto;
  };
  reports: { reportsAvailable: number };
  user: { id: string; name: string; avatar: string; roles: Role[] };
}

export function wrapJSON(json: object): UserProfileDto {
  const buff = json;
  // @ts-ignore
  buff.__proto__ = UserProfileDto.prototype;
  return buff as unknown as UserProfileDto;
}
