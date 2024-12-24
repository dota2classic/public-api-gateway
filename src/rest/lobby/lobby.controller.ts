import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from "@nestjs/common";
import { LobbyService } from "./lobby.service";
import { LobbyMapper } from "./lobby.mapper";
import { ModeratorGuard, WithUser } from "../../utils/decorator/with-user";
import {
  CurrentUser,
  CurrentUserDto,
} from "../../utils/decorator/current-user";
import { ChangeTeamInLobbyDto, LobbyDto, UpdateLobbyDto } from "./lobby.dto";
import { ApiTags } from "@nestjs/swagger";
import { ReqLoggingInterceptor } from "../../middleware/req-logging.interceptor";

@UseInterceptors(ReqLoggingInterceptor)
@ApiTags("lobby")
@Controller("lobby")
export class LobbyController {
  constructor(
    private readonly lobbyService: LobbyService,
    private readonly lobbyMapper: LobbyMapper,
  ) {}

  @ModeratorGuard()
  @WithUser()
  @Get("/")
  public async listLobbies(
    @CurrentUser() user: CurrentUserDto,
  ): Promise<LobbyDto[]> {
    return this.lobbyService
      .allLobbies()
      .then((ls) => Promise.all(ls.map(this.lobbyMapper.mapLobby)));
  }

  @ModeratorGuard()
  @WithUser()
  @Post("/")
  public async createLobby(
    @CurrentUser() user: CurrentUserDto,
  ): Promise<LobbyDto> {
    return this.lobbyService.createLobby(user).then(this.lobbyMapper.mapLobby);
  }

  @WithUser()
  @Post("/:id/join")
  public async joinLobby(
    @Param("id") id: string,
    @CurrentUser() user: CurrentUserDto,
  ): Promise<LobbyDto> {
    return this.lobbyService
      .joinLobby(id, user)
      .then(this.lobbyMapper.mapLobby);
  }

  @WithUser()
  @Post("/:id/changeTeam")
  public async changeTeam(
    @Param("id") id: string,
    @CurrentUser() user: CurrentUserDto,
    @Body() dto: ChangeTeamInLobbyDto,
  ): Promise<LobbyDto> {
    return this.lobbyService
      .changeTeam(id, user, dto.steamId, dto.team, dto.index || 0)
      .then(this.lobbyMapper.mapLobby);
  }

  @WithUser()
  @Post("/:id/leave")
  public async leaveLobby(
    @Param("id") id: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    await this.lobbyService.leaveLobby(id, user);
  }

  @WithUser()
  @Post("/:id/start")
  public async startLobby(
    @Param("id") id: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    await this.lobbyService.startLobby(id, user);
  }

  @WithUser()
  @Patch("/:id")
  public async updateLobby(
    @Param("id") id: string,
    @CurrentUser() user: CurrentUserDto,
    @Body() dto: UpdateLobbyDto,
  ): Promise<LobbyDto> {
    return this.lobbyService
      .updateLobby(id, user, dto.gameMode, dto.map)
      .then(this.lobbyMapper.mapLobby);
  }

  @WithUser()
  @Get("/:id")
  public async getLobby(
    @Param("id") id: string,
    @CurrentUser() user: CurrentUserDto,
  ): Promise<LobbyDto> {
    return this.lobbyService.getLobby(id, user).then(this.lobbyMapper.mapLobby);
  }

  @WithUser()
  @Delete("/:id")
  public async closeLobby(
    @Param("id") id: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    await this.lobbyService.closeLobby(id, user);
  }
}
