import {
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JwtService } from "@nestjs/jwt";
import { steam64to32 } from "../utils/steamIds";
import { TOKEN_KEY } from "../utils/env";
import { ApiExcludeEndpoint, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { UserLoggedInEvent } from "../gateway/events/user/user-logged-in.event";
import { PlayerId } from "../gateway/shared-types/player-id";
import { CookieOptions, Response } from "express";
import {
  AccessToken,
  CurrentUser,
  CurrentUserDto,
} from "../utils/decorator/current-user";
import { AuthService } from "./auth/auth.service";
import { WithUser } from "../utils/decorator/with-user";
import { ConfigService } from "@nestjs/config";
import { EventBus } from "@nestjs/cqrs";
import { SteamAuthGuard } from "./strategy/steam-auth.guard";
import { FastifyReply, FastifyRequest } from "fastify";

@Controller("auth/steam")
@ApiTags("auth")
export class SteamController {
  private logger = new Logger(SteamController.name);

  public static TOKEN_COOKIE_OPTIONS: CookieOptions = {
    maxAge: 1000 * 60 * 60 * 24 * 30,
  };
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly config: ConfigService,
    private readonly ebus: EventBus,
  ) {}

  @Post("steam_session_ticket")
  @ApiOkResponse({
    description: "New token",
    type: String,
  })
  public async steamSessionTicketToToken(
    @Res() res: Response,
    @Query("ticket") ticket: string,
  ) {
    const newToken =
      await this.authService.authorizeSessionTokenLauncher(ticket);
    if (!newToken) {
      res.status(401).send();
    }
    res.status(200).send(newToken);
  }

  @Post("refresh_token")
  @WithUser()
  @ApiOkResponse({
    description: "New token",
    type: String,
  })
  public async refreshToken(
    @AccessToken() token: string,
    @CurrentUser() user: CurrentUserDto,
    @Res() res: FastifyReply,
  ) {
    this.logger.verbose(`Refresh token for ${user?.steam_id}`);
    const newToken = await this.authService.refreshToken(token);

    res
      .setCookie(TOKEN_KEY, newToken, SteamController.TOKEN_COOKIE_OPTIONS)
      .status(200)
      .send(newToken);
  }

  @Get()
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard("steam"))
  async steamAuth(@Req() req) {}

  @Get("callback")
  @ApiExcludeEndpoint()
  @UseGuards(SteamAuthGuard)
  async steamAuthRequest(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const usr = (req as unknown as any)["user"] as {
      _json: {
        steamid: string;
        communityvisibilitystate: number;
        profilestate: number;
        personaname: string;
        commentpermission: number;
        profileurl: string;
        avatar: string;
        avatarmedium: string;
        avatarfull: string;
        avatarhash: string;
        lastlogoff: number;
        personastate: number;
        realname: string;
        primaryclanid: string;
        timecreated: number;
        personastateflags: number;
        loccountrycode: string;
        locstatecode: string;
      };
    };
    const steam32id = steam64to32(usr!!._json.steamid);
    this.logger.log("Login user", usr!!._json);

    this.logger.log("Login: cookies", req.cookies);

    this.ebus.publish(
      new UserLoggedInEvent(
        new PlayerId(steam32id),
        usr!!._json.personaname,
        usr!!._json.avatarfull,
        req.cookies["d2c:referral"],
      ),
    );

    const isStoreRedirect = req.cookies["d2c:auth_redirect"] === "store";

    this.logger.log("Redirecting to: " + isStoreRedirect ? "store" : "profile");

    const token = await this.authService.createToken(
      steam32id,
      usr!!._json.personaname,
      usr!!._json.avatarfull,
    );

    const redirectPath = isStoreRedirect ? "/store" : `/players/${steam32id}`;

    res
      .setCookie(TOKEN_KEY, token, SteamController.TOKEN_COOKIE_OPTIONS) // 30 days expires
      .redirect(`${this.config.get("api.frontUrl")}${redirectPath}`);
  }
}
