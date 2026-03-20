import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { SteamController } from "../steam.controller";
import { DiscordController } from "../discord.controller";
import { TwitchController } from "../twitch.controller";
import SteamStrategy from "../strategy/steam.strategy";
import { JwtStrategy } from "../strategy/jwt.strategy";
import { DiscordStrategy } from "../strategy/discord.strategy";
import TwitchStrategy from "../strategy/twitch.strategy";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SteamidHwidEntryEntity } from "../database/entities/steamid-hwid-entry.entity";
import { PlayerModule } from "../player/player.module";

@Module({
  imports: [TypeOrmModule.forFeature([SteamidHwidEntryEntity]), PlayerModule],
  controllers: [AuthController, SteamController, DiscordController, TwitchController],
  providers: [AuthService, SteamStrategy, JwtStrategy, DiscordStrategy, TwitchStrategy],
  exports: [AuthService],
})
export class AuthModule {}
