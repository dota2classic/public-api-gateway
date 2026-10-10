import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ServerController } from "./server.controller";
import { AdminUserController } from "./admin-user.controller";
import { AdminMapper } from "./admin.mapper";
import { PlayerFlagsEntity } from "../database/entities/player-flags.entity";
import { SteamidHwidEntryEntity } from "../database/entities/steamid-hwid-entry.entity";
import { SmurfLinksService } from "./smurf-links.service";
import { LauncherHwidLoginHandler } from "./event-handler/launcher-hwid-login.handler";
import { NotificationModule } from "../notification/notification.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([PlayerFlagsEntity, SteamidHwidEntryEntity]),
    NotificationModule,
  ],
  controllers: [ServerController, AdminUserController],
  providers: [AdminMapper, SmurfLinksService, LauncherHwidLoginHandler],
})
export class AdminModule {}
