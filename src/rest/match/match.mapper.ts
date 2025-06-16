import { Injectable } from "@nestjs/common";
import {
  GameserverMatchDto,
  GameserverMatchPageDto,
  GameserverMatchReportMatrixDto,
  GameserverMmrChangeDto,
  GameserverPlayerInMatchDto,
} from "../../generated-api/gameserver/models";
import {
  MatchDto,
  MatchPageDto,
  MatchReportInfoDto,
  MmrChangeDto,
  PlayerInMatchDto,
} from "./dto/match.dto";
import { MATCH_REPORT_TIMEOUT } from "../../gateway/shared-types/timings";
import { ConfigService } from "@nestjs/config";
import { MatchmakingMode } from "../../gateway/shared-types/matchmaking-mode";
import { UserProfileService } from "../../service/user-profile.service";

@Injectable()
export class MatchMapper {
  constructor(
    private readonly user: UserProfileService,
    private readonly configService: ConfigService,
  ) {}

  public mapMmr = (it: GameserverMmrChangeDto): MmrChangeDto => ({
    mmr_before: it.mmr_before,
    mmr_after: it.mmr_after,
    change: it.change,
    is_hidden_mmr: it.is_hidden,
    calibration: it.calibration,
  });

  public mapPlayerInMatch = async (
    it: GameserverPlayerInMatchDto,
  ): Promise<PlayerInMatchDto> => {
    const { steam_id, ...dto } = it;
    return {
      ...dto,
      partyIndex: dto.partyIndex,
      user: await this.user.userDto(it.steam_id),
      mmr: it.mmr && this.mapMmr(it.mmr),
    };
  };

  public mapMatch = async (
    it: GameserverMatchDto,
    mapForSteamId?: string,
  ): Promise<MatchDto> => {
    const timeDiff = new Date().getTime() - new Date(it.timestamp).getTime();

    return {
      id: it.id,
      mode: it.mode,
      game_mode: it.game_mode,
      winner: it.winner,
      duration: it.duration,
      timestamp: it.timestamp,
      radiant: await Promise.all(it.radiant.map(this.mapPlayerInMatch)),
      dire: await Promise.all(it.dire.map(this.mapPlayerInMatch)),
      replayUrl:
        it.id > 16500 && it.mode !== MatchmakingMode.BOTS
          ? `${this.configService.get("api.replayUrl")}${it.id}.dem`
          : undefined,
    };
  };

  public mapReportMatrixDto = (
    reportMatrix: GameserverMatchReportMatrixDto,
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
    it: GameserverMatchPageDto,
    mapForSteamId?: string,
  ): Promise<MatchPageDto> => {
    return {
      ...it,
      data: await Promise.all(
        it.data.map((t) => this.mapMatch(t, mapForSteamId)),
      ),
    };
  };
}
