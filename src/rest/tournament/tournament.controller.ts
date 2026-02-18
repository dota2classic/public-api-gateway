import { Body, Controller, ForbiddenException, Get, Param, Patch, Post, } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { TournamentApi } from "../../generated-api/tournament";
import { AdminGuard, NoPermabanGuard, WithUser, } from "../../utils/decorator/with-user";
import { CurrentUser, CurrentUserDto, } from "../../utils/decorator/current-user";
import { PartyService } from "../party.service";
import {
  ConfirmRegistrationDto,
  CreateTournamentDto,
  InviteToRegistrationDto,
  ReplyInvitationDto,
  ResetGameDataDto,
  ScheduleTournamentGameDto,
  SetMatchResultDto,
  UpdateTournamentDto,
} from "./tournament.dto";
import { TournamentMapper } from "./tournament.mapper";
import { BanLevel, PlayerBanService } from "../../service/player-ban.service";

@Controller("tournament")
@ApiTags("tournament")
export class TournamentController {
  constructor(
    private readonly api: TournamentApi,
    private readonly partyService: PartyService,
    private readonly mapper: TournamentMapper,
    private readonly playerBan: PlayerBanService,
  ) {}

  /* ============================
   * Public / Authenticated
   * ============================ */

  @Get("/list")
  public async listTournaments() {
    const tournaments = await this.api.tournamentControllerListTournaments();
    return Promise.all(tournaments.map(this.mapper.mapTournament));
  }

  @Get("/:id")
  public getTournament(@Param("id") id: number) {
    return this.api
      .tournamentControllerGetTournament(id)
      .then(this.mapper.mapTournament);
  }

  @Get("/:id/matches")
  public getMatches(@Param("id") id: number) {
    return this.api
      .tournamentControllerGetTournamentMatches(id)
      .then((matches) => Promise.all(matches.map(this.mapper.mapMatch)));
  }

  @Get("/:id/matches/:match_id")
  public getMatch(@Param("id") id: number, @Param("match_id") matchId: number) {
    return this.api
      .tournamentControllerGetMatch(id, matchId)
      .then(this.mapper.mapMatch);
  }

  @Get("/:id/standings")
  public getStandings(@Param("id") id: number) {
    return this.api
      .tournamentControllerGetTournamentStandings(id)
      .then((matches) => Promise.all(matches.map(this.mapper.mapStanding)));
  }

  @Get("/:id/bracket")
  public getBracket(@Param("id") id: number) {
    return this.api
      .tournamentControllerGetBracketRender(id)
      .then(this.mapper.mapBracket);
  }

  @WithUser()
  @Post("/:id/register")
  public async register(
    @CurrentUser() user: CurrentUserDto,
    @Param("id") id: number,
  ) {
    const party = await this.partyService.getPartyRaw(user.steam_id);
    const banInfos = await Promise.all(
      party.players.map((sid) => this.playerBan.getBanStatus(sid)),
    );
    if (banInfos.some((bi) => bi === BanLevel.PERMANENT)) {
      throw new ForbiddenException("Нельзя участвовать в турнире");
    }

    return this.api.tournamentControllerRegister(id, {
      steamIds: party.players,
    });
  }

  @WithUser()
  @Post("/:id/unregister")
  public async unregister(
    @CurrentUser() user: CurrentUserDto,
    @Param("id") id: number,
  ) {
    await this.api.tournamentControllerUnregister(id, {
      steamId: user.steam_id,
    });
  }

  @NoPermabanGuard
  @WithUser()
  @Post("/:id/confirm_registration")
  public confirmRegistration(
    @Param("id") id: number,
    @CurrentUser() user: CurrentUserDto,
    @Body() body: ConfirmRegistrationDto,
  ) {
    return this.api.tournamentControllerConfirmRegistration(id, {
      steamId: user.steam_id,
      confirm: body.confirm,
    });
  }

  @NoPermabanGuard
  @WithUser()
  @Post("/:id/invite_to_registration")
  public async inviteToRegistration(
    @Param("id") id: number,
    @CurrentUser() user: CurrentUserDto,
    @Body() body: InviteToRegistrationDto,
  ) {
    await this.playerBan.assertNotBanned(
      body.steamId,
      BanLevel.PERMANENT,
      "Игрок заблокирован",
    );

    await this.api.tournamentControllerInviteToRegistration(id, {
      steamId: body.steamId,
      inviterSteamId: user.steam_id,
    });
  }

  @WithUser()
  @Post("/:id/reply_to_registration_invitation")
  public async replyToRegistrationInvitationR(
    @Param("id") id: number,
    @CurrentUser() user: CurrentUserDto,
    @Body() body: ReplyInvitationDto,
  ) {
    await this.api.tournamentControllerReplyRegistrationInvitation(id, {
      invitationId: body.id,
      accept: body.accept,
    });
  }

  /* ============================
   * Admin
   * ============================ */

  @AdminGuard()
  @WithUser()
  @Post("/")
  public createTournament(@Body() body: CreateTournamentDto) {
    return this.api
      .tournamentControllerCreateTournament({
        name: body.name,
        teamSize: body.teamSize,
        description: body.description,
        startDate: body.startDate,
        imageUrl: body.imageUrl,
        prize: body.prize,
        strategy: body.strategy,
        roundBestOf: body.roundBestOf,
        finalBestOf: body.finalBestOf,
        grandFinalBestOf: body.grandFinalBestOf,
        gameDurationSeconds: body.gameDurationSeconds,
        gameBreakDurationSeconds: body.gameBreakDurationSeconds,
        gameMode: body.gameMode,
      })
      .then(this.mapper.mapTournament);
  }

  @AdminGuard()
  @WithUser()
  @Patch(":id")
  async updateTournament(
    @Param("id") id: number,
    @Body() dto: UpdateTournamentDto,
  ) {
    const tournament = await this.api.tournamentControllerUpdateTournament(
      id,
      dto,
    );
    return this.mapper.mapTournament(tournament);
  }

  @AdminGuard()
  @WithUser()
  @Post("/:id/publish_tournament")
  public publishTournament(@Param("id") id: number) {
    return this.api.tournamentControllerPublishTournament(id);
  }

  @AdminGuard()
  @WithUser()
  @Post("/:id/end_registration")
  public endRegistration(@Param("id") id: number) {
    return this.api.tournamentControllerEndRegistration(id);
  }

  @AdminGuard()
  @WithUser()
  @Post("/:id/end_ready_check")
  public endReadyCheck(@Param("id") id: number) {
    return this.api.tournamentControllerEndReadyCheck(id);
  }

  @AdminGuard()
  @WithUser()
  @Post("/:id/finish_tournament")
  public finishTournament(@Param("id") id: number) {
    return this.api.tournamentControllerFinishTournament(id);
  }

  @AdminGuard()
  @WithUser()
  @Post("/:id/generate_bracket")
  public startTournament(@Param("id") id: number) {
    return this.api.tournamentControllerStartTournament(id);
  }

  @AdminGuard()
  @WithUser()
  @Post("/:id/set_game_winner")
  public setGameWinner(
    @Param("id") id: number,
    @Body() dto: SetMatchResultDto,
  ) {
    return this.api.tournamentControllerSetGameWinner(id, {
      winnerId: dto.winnerId,
      gameId: dto.gameId,
    });
  }

  @AdminGuard()
  @WithUser()
  @Post("/:id/schedule_game")
  public async scheduleGame(
    @Param("id") id: number,
    @Body() dto: ScheduleTournamentGameDto,
  ) {
    await this.api.tournamentControllerScheduleMatch(id, {
      gameId: dto.gameId,
      scheduledDate: dto.scheduledDate,
    });
  }

  @AdminGuard()
  @WithUser()
  @Post("/:id/auto_schedule_bracket")
  public autoScheduleBracket(@Param("id") id: number) {
    return this.api.tournamentControllerAutoScheduleBracket(id);
  }

  @AdminGuard()
  @WithUser()
  @Post("/:id/reset_game_data")
  public resetGameData(@Param("id") id: number, @Body() dto: ResetGameDataDto) {
    return this.api.tournamentControllerResetGameData(id, dto);
  }
}
