import { Socket } from "socket.io";

export interface PlayerSocket extends Socket {
  steamId?: string;
}
