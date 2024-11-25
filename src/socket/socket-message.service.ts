import { Injectable } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { GetUserQueueQuery } from "../gateway/queries/GetUserQueue/get-user-queue.query";
import { PlayerId } from "../gateway/shared-types/player-id";
import { GetUserQueueQueryResult } from "../gateway/queries/GetUserQueue/get-user-queue-query.result";
import { PlayerQueueStateMessageS2C } from "./messages/s2c/player-queue-state-message.s2c";
import { WebSocketServer } from "@nestjs/websockets";
import { Server as WSServer } from "socket.io";
import { GetUserRoomQuery } from "../gateway/queries/GetUserRoom/get-user-room.query";
import { GetUserRoomQueryResult } from "../gateway/queries/GetUserRoom/get-user-room-query.result";
import { PlayerRoomStateMessageS2C } from "./messages/s2c/player-room-state-message.s2c";
import { GetPartyInvitationsQuery } from "../gateway/queries/GetPartyInvitations/get-party-invitations.query";
import { GetPartyInvitationsQueryResult } from "../gateway/queries/GetPartyInvitations/get-party-invitations-query.result";
import {
  PartyInvitation,
  PlayerPartyInvitationsMessageS2C,
} from "./messages/s2c/player-party-invitations-message.s2c";

@Injectable()
export class SocketMessageService {
  @WebSocketServer()
  public server: WSServer;

  constructor(private readonly qbus: QueryBus) {}

  public async playerQueueState(
    steamId: string,
  ): Promise<PlayerQueueStateMessageS2C | undefined> {
    try {
      const result = await this.qbus.execute<
        GetUserQueueQuery,
        GetUserQueueQueryResult
      >(new GetUserQueueQuery(new PlayerId(steamId)));

      if (result.version && result.mode)
        return new PlayerQueueStateMessageS2C(result.mode, result.version);
    } catch (e) {}

    return undefined;
  }

  async playerRoomState(
    steamId: string,
  ): Promise<PlayerRoomStateMessageS2C | undefined> {
    // this thing is for "ready check state"
    const roomState = await this.qbus.execute<
      GetUserRoomQuery,
      GetUserRoomQueryResult
    >(new GetUserRoomQuery(new PlayerId(steamId)));
    if (!roomState.info) return undefined;

    // Fixme: fill from game-coordinator
    return new PlayerRoomStateMessageS2C(
      roomState.info.roomId,
      roomState.info.mode,
      [],
    );
  }

  async playerPartyInvitesState(
    steamId: string,
  ): Promise<PlayerPartyInvitationsMessageS2C> {
    const invitations = await this.qbus.execute<
      GetPartyInvitationsQuery,
      GetPartyInvitationsQueryResult
    >(new GetPartyInvitationsQuery(new PlayerId(steamId)));

    return new PlayerPartyInvitationsMessageS2C(
      invitations.invitations.map(
        (it) => new PartyInvitation(it.partyId, it.leaderId.value, it.id),
      ),
    );
  }
}
