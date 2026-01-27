import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import {
  TournamentApi,
  TournamentConfirmRegistrationDto,
} from "../../generated-api/tournament";
import { AdminGuard, WithUser } from "../../utils/decorator/with-user";
import {
  CurrentUser,
  CurrentUserDto,
} from "../../utils/decorator/current-user";
import { PartyService } from "../party.service";
import { CreateTournamentDto, UpdateTournamentDto } from "./tournament.dto";
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

  /* ============================
   * Admin
   * ============================ */

  @AdminGuard()
  @WithUser()
  @Post("/")
  public createTournament(@Body() body: CreateTournamentDto) {
    return this.api.tournamentControllerCreateTournament({
      name: body.name,
      teamSize: body.teamSize,
      description: body.description,
      startDate: body.startDate,
      imageUrl: body.imageUrl,
      strategy: body.strategy,
      roundBestOf: body.roundBestOf,
      finalBestOf: body.finalBestOf,
      grandFinalBestOf: body.grandFinalBestOf,
    });
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
  @Post("/:id/confirm_registration")
  public confirmRegistration(
    @Param("id") id: number,
    @Body() body: TournamentConfirmRegistrationDto,
  ) {
    return this.api.tournamentControllerConfirmRegistration(id, body);
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
  @Post("/:id/auto_schedule_bracket")
  public autoScheduleBracket(@Param("id") id: number) {
    return this.api.tournamentControllerAutoScheduleBracket(id);
  }
}
