import { Controller, Get, Param, Post } from "@nestjs/common";
import { LobbyService } from "./lobby.service";
import { LobbyMapper } from "./lobby.mapper";
import { ModeratorGuard, WithUser } from "../../utils/decorator/with-user";
import {
  CurrentUser,
  CurrentUserDto,
} from "../../utils/decorator/current-user";
import { LobbyDto } from "./lobby.dto";

@Controller("lobby")
export class LobbyController {
  constructor(
    private readonly lobbyService: LobbyService,
    private readonly lobbyMapper: LobbyMapper,
  ) {}

  @WithUser()
  @Get("/:id")
  public async getLobby(
    @Param("id") id: string,
    @CurrentUser() user: CurrentUserDto,
  ): Promise<LobbyDto> {
    return this.lobbyService.getLobby(id, user).then(this.lobbyMapper.mapLobby);
  }

  @WithUser()
  @ModeratorGuard()
  @Post("/")
  public async createLobby(
    @CurrentUser() user: CurrentUserDto,
  ): Promise<LobbyDto> {
    return this.lobbyService.createLobby(user).then(this.lobbyMapper.mapLobby);
  }
}
