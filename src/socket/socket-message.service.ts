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
import {
  PlayerRoomEntry,
  PlayerRoomStateMessageS2C,
} from "./messages/s2c/player-room-state-message.s2c";
import { GetPartyInvitationsQuery } from "../gateway/queries/GetPartyInvitations/get-party-invitations.query";
import { GetPartyInvitationsQueryResult } from "../gateway/queries/GetPartyInvitations/get-party-invitations-query.result";
import { PlayerPartyInvitationsMessageS2C } from "./messages/s2c/player-party-invitations-message.s2c";
import { PartyInviteReceivedMessageS2C } from "./messages/s2c/party-invite-received-message.s2c";
import { UserRepository } from "../cache/user/user.repository";
import { GetSessionByUserQueryResult } from "../gateway/queries/GetSessionByUser/get-session-by-user-query.result";
import { GetSessionByUserQuery } from "../gateway/queries/GetSessionByUser/get-session-by-user.query";
import { PlayerGameStateMessageS2C } from "./messages/s2c/player-game-state-message.s2c";
import { GetQueueStateQuery } from "../gateway/queries/QueueState/get-queue-state.query";
import { GetQueueStateQueryResult } from "../gateway/queries/QueueState/get-queue-state-query.result";
import { Dota2Version } from "../gateway/shared-types/dota2version";
import { MatchmakingModes } from "../gateway/shared-types/matchmaking-mode";
import { QueueStateMessageS2C } from "./messages/s2c/queue-state-message.s2c";

@Injectable()
export class SocketMessageService {
  @WebSocketServer()
  public server: WSServer;

  constructor(
    private readonly qbus: QueryBus,
    private readonly userRepo: UserRepository,
  ) {}

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

    return new PlayerRoomStateMessageS2C(
      roomState.info.roomId,
      roomState.info.mode,
      roomState.info.entries.map(
        (it) => new PlayerRoomEntry(it.playerId.value, it.readyState),
      ),
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
      await Promise.all(
        invitations.invitations.map(
          async (it) =>
            new PartyInviteReceivedMessageS2C(
              it.partyId,
              it.id,
              await this.userRepo.userDto(it.leaderId.value),
            ),
        ),
      ),
    );
  }

  async playerGameState(
    steamId: string,
  ): Promise<PlayerGameStateMessageS2C | undefined> {
    const res = await this.qbus.execute<
      GetSessionByUserQuery,
      GetSessionByUserQueryResult
    >(new GetSessionByUserQuery(new PlayerId(steamId)));

    return res.serverUrl
      ? new PlayerGameStateMessageS2C(res.serverUrl)
      : undefined;
  }

  async queues(): Promise<QueueStateMessageS2C[]> {
    return Promise.all(
      MatchmakingModes.map((mode) =>
        this.qbus
          .execute<
            GetQueueStateQuery,
            GetQueueStateQueryResult
          >(new GetQueueStateQuery(mode, Dota2Version.Dota_684))
          .then(
            (result) =>
              new QueueStateMessageS2C(
                mode,
                Dota2Version.Dota_684,
                result.entries
                  .map((entry) => entry.players.length)
                  .reduce((a, b) => a + b, 0),
              ),
          ),
      ),
    );
  }
}
