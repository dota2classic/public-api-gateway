import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { PlayerSocket } from "./player.socket";
import { JwtService } from "@nestjs/jwt";
import { Server as WSServer } from "socket.io";
import { SocketMessageService } from "./socket-message.service";
import { SocketDelivery } from "./socket-delivery";
import { MessageTypeS2C } from "./messages/s2c/message-type.s2c";
import { MessageTypeC2S } from "./messages/c2s/message-type.c2s";
import { Inject, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { EnterQueueMessageC2S } from "./messages/c2s/enter-queue-message.c2s";
import { SetReadyCheckMessageC2S } from "./messages/c2s/set-ready-check-message.c2s";
import {
  ReadyState,
  ReadyStateReceivedEvent,
} from "../gateway/events/ready-state-received.event";
import { PartyLeaveRequestedEvent } from "../gateway/events/party/party-leave-requested.event";
import { PartyInviteAcceptedEvent } from "../gateway/events/party/party-invite-accepted.event";
import { PartyInviteRequestedEvent } from "../gateway/events/party/party-invite-requested.event";
import { AcceptPartyInviteMessageC2S } from "./messages/c2s/accept-party-invite-message.c2s";
import { InviteToPartyMessageC2S } from "./messages/c2s/invite-to-party-message.c2s";
import { OnlineUpdateMessageS2C } from "./messages/s2c/online-update-message.s2c";
import { EventBus } from "@nestjs/cqrs";
import { SocketFullDisconnectEvent } from "./event/socket-full-disconnect.event";
import { PlayerEnterQueueRequestedEvent } from "../gateway/events/mm/player-enter-queue-requested.event";
import { PlayerLeaveQueueRequestedEvent } from "../gateway/events/mm/player-leave-queue-requested.event";

@WebSocketGateway({ cors: "*" })
export class SocketGateway implements OnGatewayDisconnect, OnGatewayConnection {
  private logger = new Logger(SocketGateway.name);

  @WebSocketServer()
  server: WSServer;

  private disconnectConsiderLeaver: {
    [key: string]: number;
  } = {};

  constructor(
    private readonly jwtService: JwtService,
    private readonly messageService: SocketMessageService,
    private readonly delivery: SocketDelivery,
    private readonly ebus: EventBus,
    @Inject("QueryCore") private readonly redis: ClientProxy,
  ) {}

  async handleConnection(client: PlayerSocket, ...args) {
    const authToken = client.handshake.auth?.token;

    try {
      const parsed = this.jwtService.verify<{ sub: string }>(authToken);

      client.steamId = parsed.sub;
      this.stopDisconnectCountdown(client);

      await this.shareInitialData(client);
    } catch (e) {
      client.steamId = undefined;
    }

    await this.updateOnline();
  }

  async handleDisconnect(client: PlayerSocket) {
    if (client.steamId) {
      const totalConnections = this.totalConnections(client.steamId);

      if (totalConnections === 0) {
        this.startDisconnectCountdown(client);
      }
    }

    await this.updateOnline();
  }

  @SubscribeMessage(MessageTypeC2S.ENTER_QUEUE)
  async onEnterQueue(
    @MessageBody() data: EnterQueueMessageC2S,
    @ConnectedSocket() client: PlayerSocket,
  ) {
    await this.redis
      .emit(
        PlayerEnterQueueRequestedEvent.name,
        new PlayerEnterQueueRequestedEvent(client.steamId, data.modes),
      )
      .toPromise();
  }

  @SubscribeMessage(MessageTypeC2S.LEAVE_ALL_QUEUES)
  async leaveAllQueues(@ConnectedSocket() client: PlayerSocket) {
    await this.redis
      .emit(
        PlayerLeaveQueueRequestedEvent.name,
        new PlayerLeaveQueueRequestedEvent(client.steamId),
      )
      .toPromise();
  }

  @SubscribeMessage(MessageTypeC2S.SET_READY_CHECK)
  async acceptGame(
    @MessageBody() data: SetReadyCheckMessageC2S,
    @ConnectedSocket() client: PlayerSocket,
  ) {
    this.redis.emit(
      ReadyStateReceivedEvent.name,
      new ReadyStateReceivedEvent(
        client.steamId,
        data.roomId,
        data.accept ? ReadyState.READY : ReadyState.DECLINE,
      ),
    );
  }

  @SubscribeMessage(MessageTypeC2S.INVITE_TO_PARTY)
  async inviteParty(
    @MessageBody() data: InviteToPartyMessageC2S,
    @ConnectedSocket() client: PlayerSocket,
  ) {
    await this.redis
      .emit(
        PartyInviteRequestedEvent.name,
        new PartyInviteRequestedEvent(client.steamId, data.invitedPlayerId),
      )
      .toPromise();
  }

  @SubscribeMessage(MessageTypeC2S.ACCEPT_PARTY_INVITE)
  async acceptPartyInvite(
    @MessageBody() data: AcceptPartyInviteMessageC2S,
    @ConnectedSocket() client: PlayerSocket,
  ) {
    await this.redis
      .emit(
        PartyInviteAcceptedEvent.name,
        new PartyInviteAcceptedEvent(data.inviteId, data.accept),
      )
      .toPromise();
  }

  @SubscribeMessage(MessageTypeC2S.LEAVE_PARTY)
  async leaveParty(@ConnectedSocket() client: PlayerSocket) {
    await this.redis
      .emit(
        PartyLeaveRequestedEvent.name,
        new PartyLeaveRequestedEvent(client.steamId),
      )
      .toPromise();
  }

  private stopDisconnectCountdown(client: PlayerSocket) {
    const existingTimer = this.disconnectConsiderLeaver[client.steamId];
    if (existingTimer) {
      clearTimeout(existingTimer);
    }
  }

  private startDisconnectCountdown(client: PlayerSocket) {
    const timer = setTimeout(() => {
      this.ebus.publish(new SocketFullDisconnectEvent(client.steamId));
    }, 60_000);
    this.stopDisconnectCountdown(client);
    this.disconnectConsiderLeaver[client.steamId] = timer as unknown as number;
  }

  private async updateOnline() {
    // We count: unique steamIds + unique ips if no steamid
    const authorizedClients = new Set(
      Array.from(this.server.sockets.sockets.values()).map(
        (it: PlayerSocket) => it.steamId,
      ),
    );

    const uniqueUsers = new Set(
      Array.from(this.server.sockets.sockets.values()).map(
        (it) => it.request.connection.remoteAddress,
      ),
    );

    this.logger.log("Trash log: ", {
      users: Array.from(this.server.sockets.sockets.values()).map(
        (it) => it.request.connection.remoteAddress,
      ),
    });

    this.logger.log("Online update", {
      authorized: authorizedClients.size,
    });

    this.server.emit(
      MessageTypeS2C.ONLINE_UPDATE,
      new OnlineUpdateMessageS2C(
        Array.from(authorizedClients.values()),
        uniqueUsers.size,
      ) as any,
    );
  }

  private async shareInitialData(socket: PlayerSocket) {
    // PlayerQueueState
    const playerQueueState = await this.messageService.playerQueueState(
      socket.steamId,
    );
    socket.emit(MessageTypeS2C.PLAYER_QUEUE_STATE, playerQueueState);

    // RoomState
    const playerRoomState = await this.messageService.playerRoomState(
      socket.steamId,
    );
    socket.emit(MessageTypeS2C.PLAYER_ROOM_STATE, playerRoomState);

    // PartyInvites
    const partyInvState = await this.messageService.playerPartyInvitesState(
      socket.steamId,
    );
    socket.emit(MessageTypeS2C.PLAYER_PARTY_INVITES_STATE, partyInvState);

    // GameState
    const gameState = await this.messageService.playerGameState(socket.steamId);
    socket.emit(MessageTypeS2C.PLAYER_GAME_STATE, gameState);

    // General queues
    const queuesStates = await this.messageService.queues();
    queuesStates.forEach((state) =>
      socket.emit(MessageTypeS2C.QUEUE_STATE, state),
    );

    socket.emit(MessageTypeS2C.CONNECTION_COMPLETE);
  }

  private totalConnections(steamId: string) {
    return Array.from(this.server.sockets.sockets.values()).filter(
      (it: PlayerSocket) => it.steamId === steamId,
    ).length;
  }
}
