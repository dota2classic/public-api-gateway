import { Controller, Get, Inject, Req, Res, UseGuards } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { frontUrl } from '../utils/utils';
import { ClientProxy } from '@nestjs/microservices';
import { CookieUserGuard } from '../utils/decorator/with-user';
import { CookiesUserId } from '../utils/decorator/current-user';
import { AttachUserConnectionCommand } from '../gateway/commands/attach-user-connection.command';
import { PlayerId } from '../gateway/shared-types/player-id';
import { UserConnection } from '../gateway/shared-types/user-connection';
import { numSteamId } from '../utils/steamIds';

@Controller('auth/discord')
export class DiscordController {
  constructor(
    @Inject('QueryCore') private readonly redisEventQueue: ClientProxy,
  ) {}

  @Get()
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard('discord'))
  async discordAuth(@Req() req) {}

  @Get('callback')
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard('discord'), CookieUserGuard)
  async discordRedirect(
    @Req() req,
    @Res() res,
    @CookiesUserId() steam_id: string,
  ) {
    if (!req.user) {
      return 'No user from discord';
    }

    await this.redisEventQueue.emit(
      AttachUserConnectionCommand.name,
      new AttachUserConnectionCommand(
        new PlayerId(steam_id),
        UserConnection.DISCORD,
        req.user.id,
      ),
    );

    const numericalSteamId = numSteamId(steam_id)

    res.status(302).redirect(`${frontUrl}/player/${numericalSteamId}`);
  }
}
