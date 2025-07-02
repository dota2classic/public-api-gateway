import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Sse,
  UseInterceptors,
} from "@nestjs/common";
import { LobbyService } from "./lobby.service";
import { LobbyMapper } from "./lobby.mapper";
import { OldGuard, WithUser } from "../../utils/decorator/with-user";
import {
  CurrentUser,
  CurrentUserDto,
} from "../../utils/decorator/current-user";
import {
  ChangeTeamInLobbyDto,
  JoinLobbyDto,
  KickPlayerDto,
  LobbyAction,
  LobbyDto,
  LobbyUpdateDto,
  UpdateLobbyDto,
} from "./lobby.dto";
import { ApiParam, ApiTags } from "@nestjs/swagger";
import { ReqLoggingInterceptor } from "../../middleware/req-logging.interceptor";
import { filter, Observable } from "rxjs";
import { asyncMap } from "rxjs-async-map";
import { EventBus } from "@nestjs/cqrs";
import { LobbyUpdatedEvent } from "./event/lobby-updated.event";
import { ClientProxy } from "@nestjs/microservices";

@UseInterceptors(ReqLoggingInterceptor)
@ApiTags("lobby")
@Controller("lobby")
export class LobbyController {
  constructor(
    private readonly lobbyService: LobbyService,
    private readonly lobbyMapper: LobbyMapper,
    private readonly ebus: EventBus,
    @Inject("MatchmakerEvents") private readonly rmq: ClientProxy,
  ) {}

  @Get("/")
  public async listLobbies(): Promise<LobbyDto[]> {
    return this.lobbyService
      .allLobbies()
      .then((ls) =>
        Promise.all(ls.map((item) => this.lobbyMapper.mapLobby(item))),
      );
  }

  @OldGuard()
  @WithUser()
  @Post("/")
  public async createLobby(
    @CurrentUser() user: CurrentUserDto,
  ): Promise<LobbyDto> {
    return this.lobbyService
      .createLobby(user)
      .then((item) => this.lobbyMapper.mapLobby(item, user.steam_id));
  }

  @WithUser()
  @Post("/:id/join")
  public async joinLobby(
    @Param("id") id: string,
    @Body() dto: JoinLobbyDto,
    @CurrentUser() user: CurrentUserDto,
  ): Promise<LobbyDto> {
    return this.lobbyService
      .joinLobby(id, user, dto.password)
      .then((item) => this.lobbyMapper.mapLobby(item, user.steam_id));
  }

  @Post("/:id/kickPlayer")
  @WithUser()
  public async kickPlayer(
    @Param("id") id: string,
    @CurrentUser() user: CurrentUserDto,
    @Body() dto: KickPlayerDto,
  ): Promise<LobbyDto> {
    return this.lobbyService
      .kickPlayer(id, user, dto.steamId)
      .then((item) => this.lobbyMapper.mapLobby(item, user.steam_id));
  }

  @Post("/:id/changeTeam")
  @WithUser()
  public async changeTeam(
    @Param("id") id: string,
    @CurrentUser() user: CurrentUserDto,
    @Body() dto: ChangeTeamInLobbyDto,
  ): Promise<LobbyDto> {
    return this.lobbyService
      .changeTeam(id, user, dto.steamId, dto.team, dto.index || 0)
      .then((item) => this.lobbyMapper.mapLobby(item, user.steam_id));
  }

  @Post("/:id/leave")
  @WithUser()
  public async leaveLobby(
    @Param("id") id: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    await this.lobbyService.leaveLobby(id, user);
  }

  @Post("/:id/start")
  @WithUser()
  public async startLobby(
    @Param("id") id: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    await this.lobbyService.startLobby(id, user);
  }

  @Post("/:id/shuffle")
  @WithUser()
  public async shuffleLobby(
    @Param("id") id: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    await this.lobbyService.shuffleLobby(id, user);
  }

  @Patch("/:id")
  @WithUser()
  public async updateLobby(
    @Param("id") id: string,
    @CurrentUser() user: CurrentUserDto,
    @Body() dto: UpdateLobbyDto,
  ): Promise<LobbyDto> {
    return this.lobbyService
      .updateLobby(
        id,
        user,
        dto.gameMode,
        dto.map,
        dto.password,
        dto.name,
        dto.enableCheats,
        dto.fillBots,
      )
      .then((item) => this.lobbyMapper.mapLobby(item, user.steam_id));
  }

  @Get("/:id")
  @WithUser()
  public async getLobby(
    @Param("id") id: string,
    @CurrentUser() user: CurrentUserDto,
  ): Promise<LobbyDto> {
    return this.lobbyService
      .getLobby(id, user)
      .then((item) => this.lobbyMapper.mapLobby(item, user.steam_id));
  }

  @ApiParam({
    name: "id",
    required: true,
  })
  @Sse("/sse/:id")
  @WithUser()
  public lobbyUpdates(
    @Param("id") id: string,
    @CurrentUser() user: CurrentUserDto,
  ): Observable<LobbyUpdateDto> {
    return this.ebus.pipe(
      filter((it) => it instanceof LobbyUpdatedEvent && it.lobbyId === id),
      asyncMap(async (mce: LobbyUpdatedEvent) => {
        let dto: LobbyDto;
        if ("lobbyEntity" in mce) {
          dto = await this.lobbyMapper.mapLobby(mce.lobbyEntity, user.steam_id);
        }
        return {
          data: {
            lobbyId: mce.lobbyId,
            action: mce.action,
            data: dto,
            kickedSteamIds: mce.kickedIds,
          },
        } satisfies LobbyUpdateDto;
      }, 1),
    );
  }

  @WithUser()
  @Delete("/:id")
  public async closeLobby(
    @Param("id") id: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    await this.lobbyService.closeLobby(id, user, LobbyAction.Close);
  }
}
