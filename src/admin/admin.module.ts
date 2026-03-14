import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ServerController } from "./server.controller";
import { AdminUserController } from "./admin-user.controller";
import { AdminMapper } from "./admin.mapper";
import { PlayerFlagsEntity } from "../entity/player-flags.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PlayerFlagsEntity])],
  controllers: [ServerController, AdminUserController],
  providers: [AdminMapper],
})
export class AdminModule {}
