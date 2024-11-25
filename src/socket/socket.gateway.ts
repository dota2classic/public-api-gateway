import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { PlayerSocket } from "./player.socket";
import { JwtService } from "@nestjs/jwt";
import { Server as WSServer } from "socket.io";
import { SocketMessageService } from "./socket-message.service";
import { SocketDelivery } from "./socket-delivery";
import { MessageTypeS2C } from "./messages/s2c/message-type.s2c";

@WebSocketGateway({ cors: "*" })
export class SocketGateway implements OnGatewayDisconnect, OnGatewayConnection {
  @WebSocketServer()
  server: WSServer;

  constructor(
    private readonly jwtService: JwtService,
    private readonly messageService: SocketMessageService,
    private readonly delivery: SocketDelivery,
  ) {}

  async handleConnection(client: PlayerSocket, ...args) {
    const authToken = client.handshake.auth?.token;
    try {
      const parsed = this.jwtService.verify<{ sub: string }>(authToken);

      client.steamId = parsed.sub;

      await this.shareInitialData(client);
    } catch (e) {
      client.steamId = undefined;
    }
  }

  handleDisconnect(client: any): any {
    // Todo online handle
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
    socket.emit(MessageTypeS2C.PLAYER_PARTY_STATE, partyInvState);
  }

  private async totalConnections(steamId: string) {
    return Array.from(this.server.sockets.sockets.values()).filter(
      (it: PlayerSocket) => it.steamId === steamId,
    ).length;
  }
}
