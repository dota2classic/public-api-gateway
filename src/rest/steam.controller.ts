import {
  Controller,
  Get,
  Inject,
  Logger,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { frontUrl } from '../utils/utils';
import { JwtService } from '@nestjs/jwt';
import { steam64to32 } from '../utils/steamIds';
import { TOKEN_KEY } from '../utils/env';
import { ApiExcludeEndpoint, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserRepository } from '../cache/user/user.repository';
import { UserLoggedInEvent } from '../gateway/events/user/user-logged-in.event';
import { PlayerId } from '../gateway/shared-types/player-id';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import {
  AccessToken,
  CurrentUser,
  CurrentUserDto,
} from '../utils/decorator/current-user';
import { AuthService } from './auth/auth.service';
import { WithUser } from '../utils/decorator/with-user';

@Controller('auth/steam')
@ApiTags('auth')
export class SteamController {
  private logger = new Logger(SteamController.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    @Inject('QueryCore') private readonly rq: ClientProxy,
    private readonly authService: AuthService,
  ) {}

  @Post('refresh_token')
  @WithUser()
  @ApiOkResponse({
    description: 'New token',
    type: String,
  })
  public async refreshToken(
    @AccessToken() token: string,
    @CurrentUser() user: CurrentUserDto,
    @Res() res: Response,
  ) {
    this.logger.verbose(`Refresh token for ${user?.steam_id}`);
    const newToken = await this.authService.refreshToken(token);
    res
      .cookie(TOKEN_KEY, newToken)
      .status(200)
      .send(newToken);
  }

  @Get()
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard('steam'))
  async steamAuth(@Req() req) {}

  @Get('callback')
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard('steam'))
  async steamAuthRequest(
    @Req() req: Request & { user?: any },
    @Res() res: Response,
  ) {
    const steam32id = steam64to32(req.user!!._json.steamid);

    this.rq.emit(
      UserLoggedInEvent.name,
      new UserLoggedInEvent(
        new PlayerId(steam32id),
        req.user!!._json.personaname,
        req.user!!._json.avatarfull,
      ),
    );

    console.log(req.user!!._json);
    const token = await this.authService.createToken(
      steam32id,
      req.user!!._json.personaname,
      req.user!!._json.avatarfull,
    );
    res.cookie(TOKEN_KEY, token).redirect(`${frontUrl}/players/${steam32id}`);
  }
}
