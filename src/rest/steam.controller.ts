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

  public TOKEN_COOKIE_OPTIONS: () => CookieOptions = () => {
    return {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      path: "/",
      httpOnly: false,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      secure: true,
      domain: `.${this.config.get("api.baseDomain")}`,
    };
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
      .setCookie(TOKEN_KEY, newToken, this.TOKEN_COOKIE_OPTIONS())
      .status(200)
      .send(newToken);
  }

  @Get("login_init")
  @ApiExcludeEndpoint()
  async steamAuthPre(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    // Save current URL or hostname
    const currentUrl = `${req.protocol}://${req.hostname}${req.originalUrl}`;

    console.log("Setting current url as cookie!", currentUrl);

    res
      .setCookie("d2c:auth_redirect", req.query["redirect"], {
        httpOnly: false,
        sameSite: "lax",
        path: "/",
        domain: `.${this.config.get("api.baseDomain")}`,
        maxAge: 60 * 60 * 24 * 7, // optional expiry
      })
      .redirect("/api/v1/auth/steam", 302);
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
    this.logger.log("SteamControllerCallback", usr);
    const steam32id = steam64to32(usr!!.steamid);
    this.logger.log("Login user", usr!!);

    this.logger.log("Login: cookies", req.cookies);

    this.ebus.publish(
      new UserLoggedInEvent(
        new PlayerId(steam32id),
        usr!!.personaname,
        usr!!.avatarfull,
        req.cookies["d2c:referral"],
      ),
    );

    console.log("AUTH REDIRECT: HOSTNAME", req.hostname);
    console.log(
      "Refererer",
      req.originalUrl,
      req.headers["referer"] || req.headers["referrer"],
    );

    const isHrefRedirect =
      req.cookies["d2c:auth_redirect"] &&
      req.cookies["d2c:auth_redirect"].startsWith("https");

    this.logger.log("Redirecting to: " + (isHrefRedirect ? "href" : "profile"));

    const token = await this.authService.createToken(
      steam32id,
      usr!!.personaname,
      usr!!.avatarfull,
    );

    const redirectPath = isHrefRedirect
      ? req.cookies["d2c:auth_redirect"]
      : `${this.config.get("api.frontUrl")}/players/${steam32id}}`;

    res
      .setCookie(TOKEN_KEY, token, this.TOKEN_COOKIE_OPTIONS()) // 30 days expires
      .redirect(redirectPath, 302);
  }
}
