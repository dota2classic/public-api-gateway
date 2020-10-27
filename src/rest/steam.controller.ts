import {
  Controller,
  Get,
  Injectable,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { frontUrl } from '../utils';


@Controller('auth/steam')
export class SteamController {
  constructor() {}

  @Get()
  @UseGuards(AuthGuard('steam'))
  async discordAuth(@Req() req) {}

  @Get('callback')
  @UseGuards(AuthGuard('steam'))
  async steamAuthRequest(@Req() req, @Res() res) {
    // @ts-ignore
    console.log('YAI!!', req.user!!._json.steamid);

    // const steam32id = steam64to32(req.user!!._json.steamid);

    // await this.authService.attachSteam(
    //   // @ts-ignore
    //   steam32id,
    //   cookieUserId,
    // );
    res.status(302).redirect(`${frontUrl}/me`);
  }
}