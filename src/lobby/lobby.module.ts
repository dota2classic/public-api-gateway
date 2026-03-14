import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LobbyController } from "./lobby.controller";
import { LobbyMapper } from "./lobby.mapper";
import { LobbyUpdatedHandler } from "./event-handler/lobby-updated.handler";
import { LeaveLobbySocketDisconnectHandler } from "./event-handler/leave-lobby-socket-disconnect.handler";
import { LobbyEntity } from "../entity/lobby.entity";
import { LobbySlotEntity } from "../entity/lobby-slot.entity";

@Module({
  imports: [TypeOrmModule.forFeature([LobbyEntity, LobbySlotEntity])],
  controllers: [LobbyController],
  providers: [
    LobbyMapper,
    LobbyUpdatedHandler,
    LeaveLobbySocketDisconnectHandler,
  ],
})
export class LobbyModule {}
