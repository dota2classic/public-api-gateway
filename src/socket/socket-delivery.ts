import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server as WSServer } from "socket.io";
import { PlayerSocket } from "./player.socket";
import { MessageTypeS2C } from "./messages/s2c/message-type.s2c";

@WebSocketGateway()
export class SocketDelivery {
  @WebSocketServer()
  public server: WSServer;

  public async broadcastAll<T>(message: MessageTypeS2C, payload: T) {
    this.server.emit(message, payload);
    // Array.from(this.server.sockets.sockets.values()).forEach(
    //   (socket: PlayerSocket) => {
    //     socket.emit(message, payload);
    //   },
    // );
  }

  public async broadcastAuthorized<T>(
    steamIds: string[],
    supply: (p: string) => [MessageTypeS2C, T],
  ) {
    steamIds.forEach((plr) => {
      const [key, payload] = supply(plr);
      this.deliver(plr, key, payload);
    });
  }

  public async deliver<T>(steamId: string, key: MessageTypeS2C, payload: T) {
    this.findAll(steamId).forEach((socket) => socket.emit(key, payload));
  }

  private findAll(steamId: string): PlayerSocket[] {
    return Array.from(this.server.sockets.sockets.values()).filter(
      (it: PlayerSocket) => it.steamId === steamId,
    ) as PlayerSocket[];
  }

  public async broadcastPredicate<T>(
    param: (steamId: string | undefined) => boolean,
    key: MessageTypeS2C,
    payload: T,
  ) {
    const targets = Array.from(this.server.sockets.sockets.values()).filter(
      (socket: PlayerSocket) => param(socket.steamId),
    );
    targets.forEach((socket) => socket.emit(key, payload));
    return targets.length;
  }

  // TODO: this maybe very shit in performance with scale
  public getOnline(): string[] {
    return Array.from(this.server.sockets.sockets.values())
      .filter((it: PlayerSocket) => !!it.steamId)
      .map((it: PlayerSocket) => it.steamId);
  }

  isOnline = (steamId: string) => this.getOnline().includes(steamId);
}
