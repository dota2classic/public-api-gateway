import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { TournamentApi } from "../../generated-api/tournament";
import { AdminGuard, WithUser } from "../../utils/decorator/with-user";
import {
  CurrentUser,
  CurrentUserDto,
} from "../../utils/decorator/current-user";
import { PartyService } from "../party.service";
import {
  ConfirmRegistrationDto,
  CreateTournamentDto,
  SetMatchResultDto,
  UpdateTournamentDto,
} from "./tournament.dto";
import { TournamentMapper } from "./tournament.mapper";

@Controller("tournament")
@ApiTags("tournament")
export class TournamentController {
  constructor(
    private readonly api: TournamentApi,
    private readonly partyService: PartyService,
    private readonly mapper: TournamentMapper,
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

    return this.api.tournamentControllerRegister(id, {
      steamIds: party.players,
    });
  }

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
  @Post("/:id/auto_schedule_bracket")
  public autoScheduleBracket(@Param("id") id: number) {
    return this.api.tournamentControllerAutoScheduleBracket(id);
  }
}
