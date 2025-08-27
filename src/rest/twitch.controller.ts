import {
  Controller,
  Get,
  Inject,
  Logger,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiExcludeEndpoint, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { CookiesUserId } from "../utils/decorator/current-user";
import { ConfigService } from "@nestjs/config";
import { EventBus } from "@nestjs/cqrs";
import { TwitchAuthGuard } from "./strategy/twitch-auth.guard";
import { CookieUserGuard } from "../utils/decorator/with-user";
import { ClientProxy } from "@nestjs/microservices";
import { AttachUserConnectionCommand } from "../gateway/commands/attach-user-connection.command";
import { PlayerId } from "../gateway/shared-types/player-id";
import { UserConnection } from "../gateway/shared-types/user-connection";

@Controller("auth/twitch")
@ApiTags("auth")
export class TwitchController {
  private logger = new Logger(TwitchController.name);

  constructor(
    private readonly config: ConfigService,
    private readonly ebus: EventBus,
    @Inject("QueryCore") private readonly redisEventQueue: ClientProxy,
  ) {}

  @Get()
  @ApiExcludeEndpoint()
  @UseGuards(TwitchAuthGuard)
  async twitchAuth(@Req() req) {}

  @Get("callback")
  @ApiExcludeEndpoint()
  @UseGuards(TwitchAuthGuard, CookieUserGuard)
  async twitchAuthRequest(
    @Req() req: Request & { user?: any },
    @Res() res: Response,
    @CookiesUserId() steam_id: string,
  ) {
    if (!req.user) {
      return "No user from discord";
    }

    this.logger.log(
      `Creating connection with steam id ${steam_id} with twitch of id ${req.user.login}`,
    );

    await this.redisEventQueue.emit(
      AttachUserConnectionCommand.name,
      new AttachUserConnectionCommand(
        new PlayerId(steam_id),
        UserConnection.TWITCH,
        req.user.login,
      ),
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("TWITCH REDIRECT: HOSTNAME", req.hostname);

    res
      .status(302)
      .redirect(`${this.config.get("api.frontUrl")}/players/${steam_id}`, 302);
  }
}
