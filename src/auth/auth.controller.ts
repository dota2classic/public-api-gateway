import { Controller, Delete, Inject, UseInterceptors } from "@nestjs/common";
import { ReqLoggingInterceptor } from "../metrics/req-logging.interceptor";
import { ApiTags } from "@nestjs/swagger";
import { WithUser } from "../utils/decorator/with-user";
import {
  CurrentUser,
  CurrentUserDto,
} from "../utils/decorator/current-user";
import { ClientProxy } from "@nestjs/microservices";
import { UserConnection } from "../gateway/shared-types/user-connection";
import { RemoveUserConnectionCommand } from "../gateway/commands/remove-user-connection.command";

@UseInterceptors(ReqLoggingInterceptor)
@Controller("settings")
@ApiTags("settings")
export class AuthController {
  constructor(
    @Inject("QueryCore") private readonly redisEventQueue: ClientProxy,
  ) {}

  @Delete("/twitch")
  @WithUser()
  public async removeTwitchConnection(@CurrentUser() user: CurrentUserDto) {
    await this.redisEventQueue.emit(
      RemoveUserConnectionCommand.name,
      new RemoveUserConnectionCommand(user.steam_id, UserConnection.TWITCH),
    );

    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}
