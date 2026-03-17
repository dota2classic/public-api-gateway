import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SocketGateway } from "./socket.gateway";
import { SocketDelivery } from "./socket-delivery";
import { SocketMessageService } from "./socket-message.service";
import { ReadyStateUpdatedHandler } from "./event-handler/ready-state-updated.handler";
import { QueueUpdatedHandler } from "./event-handler/queue-updated.handler";
import { PartyUpdatedHandler } from "./event-handler/party-updated.handler";
import { ReadyCheckStartedHandler } from "./event-handler/ready-check-started.handler";
import { PartyInviteExpiredHandler } from "./event-handler/party-invite-expired.handler";
import { PartyInviteCreatedHandler } from "./event-handler/party-invite-created.handler";
import { MatchStartedHandler } from "./event-handler/match-started.handler";
import { MatchFinishedHandler } from "./event-handler/match-finished.handler";
import { MatchCancelledHandler } from "./event-handler/match-cancelled.handler";
import { SocketFullDisconnectHandler } from "./event-handler/scoekt-full-disconnect.handler";
import { RoomNotReadyHandler } from "./event-handler/room-not-ready.handler";
import { RoomReadyHandler } from "./event-handler/room-ready.handler";
import { LobbyReadyHandler } from "./event-handler/lobby-ready.handler";
import { PartyInvalidatedHandler } from "./event-handler/party-invalidated.handler";
import { NotificationCreatedHandler } from "./event-handler/notification-created.handler";
import { GameResultsHandler } from "./event-handler/game-results.handler";
import { PartyService } from "../party.service";
import { PlayerMapper } from "../player/player.mapper";
import { MatchMapper } from "../match/match.mapper";
import { LobbyService } from "../lobby/lobby.service";
import { LobbyEntity } from "../database/entities/lobby.entity";
import { LobbySlotEntity } from "../database/entities/lobby-slot.entity";
import { GameSessionUpdateHandler } from "./event-handler/game-session-update.handler";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([LobbyEntity, LobbySlotEntity])],
  providers: [
    SocketGateway,
    SocketDelivery,
    SocketMessageService,
    ReadyStateUpdatedHandler,
    QueueUpdatedHandler,
    PartyUpdatedHandler,
    ReadyCheckStartedHandler,
    PartyInviteExpiredHandler,
    PartyInviteCreatedHandler,
    MatchStartedHandler,
    MatchFinishedHandler,
    MatchCancelledHandler,
    SocketFullDisconnectHandler,
    RoomNotReadyHandler,
    RoomReadyHandler,
    LobbyReadyHandler,
    PartyInvalidatedHandler,
    NotificationCreatedHandler,
    GameResultsHandler,
    GameSessionUpdateHandler,
    PartyService,
    PlayerMapper,
    MatchMapper,
    LobbyService,
  ],
  exports: [
    SocketDelivery,
    SocketMessageService,
    SocketGateway,
    PartyService,
    PlayerMapper,
    MatchMapper,
    LobbyService,
  ],
})
export class SocketModule {}
