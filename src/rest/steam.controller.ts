import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { frontUrl } from '../utils/utils';
import { JwtService } from '@nestjs/jwt';
import { steam64to32 } from '../utils/steamIds';
import { TOKEN_KEY } from '../utils/env';
import { ApiExcludeEndpoint } from '@nestjs/swagger';


@Controller('auth/steam')
export class SteamController {
  constructor(private jwtService: JwtService) {}

  @Get()
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard('steam'))
  async discordAuth(@Req() req) {}

  @Get('callback')
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard('steam'))
  async steamAuthRequest(@Req() req, @Res() res) {
    const steam32id = steam64to32(req.user!!._json.steamid);
    const token = this.jwtService.sign({ sub: steam32id });

    // ok here we might need to create a user pepega
    res
      .cookie(TOKEN_KEY, token)
      .redirect(`${frontUrl}/me`);
  }
}
