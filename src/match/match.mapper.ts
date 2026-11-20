import { Injectable } from "@nestjs/common";
import * as GsApi from "@dota2classic/gs-api-generated/dist/Api";
import {
  MatchDto,
  MatchPageDto,
  MatchReportInfoDto,
  MmrChangeDto,
  PlayerInMatchDto,
} from "./dto/match.dto";
import { MATCH_REPORT_TIMEOUT } from "../gateway/shared-types/timings";
import { ConfigService } from "@nestjs/config";
import { MatchmakingMode } from "../gateway/shared-types/matchmaking-mode";
import { UserProfileService } from "../service/user-profile.service";
import { asMatchmakingMode, asGameMode } from "../types/gs-api-compat";
import { UserDTO } from "../shared.dto";

@Injectable()
export class MatchMapper {
  constructor(
    private readonly user: UserProfileService,
    private readonly configService: ConfigService,
  ) {}

  public mapMmr = (it: GsApi.MmrChangeDto): MmrChangeDto => ({
    mmr_before: it.mmr_before,
    mmr_after: it.mmr_after,
    change: it.change,
    is_hidden_mmr: it.is_hidden,
    calibration: it.calibration,
    streak: it.streak,
  });

  public steamIds = (it: GsApi.MatchDto): string[] =>
    [...it.radiant, ...it.dire].map((player) => player.steam_id);

  public mapMatch = async (
    it: GsApi.MatchDto,
    mapForSteamId?: string,
  ): Promise<MatchDto> =>
    this.toMatch(it, await this.user.userDtoMap(this.steamIds(it)));

  private mapPlayerInMatch = (
    it: GsApi.PlayerInMatchDto,
    users: Map<string, UserDTO>,
  ): PlayerInMatchDto => {
    const { steam_id, ...dto } = it;
    return {
      ...dto,
      partyIndex: dto.partyIndex,
      user: users.get(steam_id),
      mmr: it.mmr && this.mapMmr(it.mmr),
      bear: dto.bear,
    };
  };

  public toMatch = (
    it: GsApi.MatchDto,
    users: Map<string, UserDTO>,
  ): MatchDto => {
    const radiant = it.radiant.map((player) => this.mapPlayerInMatch(player, users));
    const dire = it.dire.map((player) => this.mapPlayerInMatch(player, users));
    const mode = asMatchmakingMode(it.mode);

    let replayUrl: string | undefined = undefined;
    if (it.replayPath) {
      replayUrl = `${this.configService.get("api.replayUrl")}${it.replayPath.replace("replays/", "")}`;
    } else if (it.id > 16500 && mode !== MatchmakingMode.BOTS) {
      replayUrl = `${this.configService.get("api.replayUrl")}${it.id}.dem`;
    }
    return {
      id: it.id,
      mode,
      game_mode: asGameMode(it.game_mode),
      winner: it.winner,
      duration: it.duration,
      timestamp: it.timestamp,
      radiant,
      dire,

      towers: it.towerStatus,
      barracks: it.barrackStatus,

      replayUrl,
    };
  };

  public mapReportMatrixDto = (
    reportMatrix: GsApi.MatchReportMatrixDto,
    mapForSteamId: string,
  ): MatchReportInfoDto => {
    const timeDiff =
      new Date().getTime() - new Date(reportMatrix.timestamp).getTime();
    const isReportable =
      mapForSteamId !== undefined && timeDiff <= MATCH_REPORT_TIMEOUT;
    return {
      reportableSteamIds:
        isReportable && reportMatrix
          ? reportMatrix.reports
              .filter(
                (it) =>
                  it.steamId !== mapForSteamId &&
                  !it.reported.includes(mapForSteamId),
              )
              .map((it) => it.steamId)
          : [],
    };
  };

  public mapMatchPage = async (
    it: GsApi.MatchPageDto,
    mapForSteamId?: string,
  ): Promise<MatchPageDto> => {
    const users = await this.user.userDtoMap(it.data.flatMap(this.steamIds));
    return {
      ...it,
      data: it.data.map((match) => this.toMatch(match, users)),
    };
  };
}
