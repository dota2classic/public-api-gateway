import { Socket } from "socket.io";

export enum ClientType {
  LAUNCHER = "launcher",
  WEBAPP = "webapp",
}

export interface PlayerSocket extends Socket {
  steamId?: string;
  clientType: ClientType;
}
