import { Injectable, Logger } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { PlayerId } from "../gateway/shared-types/player-id";
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
import { GetSessionByUserQueryResult } from "../gateway/queries/GetSessionByUser/get-session-by-user-query.result";
import { GetSessionByUserQuery } from "../gateway/queries/GetSessionByUser/get-session-by-user.query";
import { PlayerGameStateMessageS2C } from "./messages/s2c/player-game-state-message.s2c";
import { GetQueueStateQuery } from "../gateway/queries/QueueState/get-queue-state.query";
import { GetQueueStateQueryResult } from "../gateway/queries/QueueState/get-queue-state-query.result";
import { Dota2Version } from "../gateway/shared-types/dota2version";
import { MatchmakingModes } from "../gateway/shared-types/matchmaking-mode";
import { QueueStateMessageS2C } from "./messages/s2c/queue-state-message.s2c";
import { GetPartyQuery } from "../gateway/queries/GetParty/get-party.query";
import { GetPartyQueryResult } from "../gateway/queries/GetParty/get-party-query.result";
import { PlayerQueueStateMessageS2C } from "./messages/s2c/player-queue-state-message.s2c";
import { UserProfileService } from "../service/user-profile.service";

@Injectable()
export class SocketMessageService {
  @WebSocketServer()
  public server: WSServer;

  private readonly logger = new Logger(SocketMessageService.name);

  constructor(
    private readonly qbus: QueryBus,
    private readonly user: UserProfileService,
  ) {}

  async playerRoomState(
    steamId: string,
  ): Promise<PlayerRoomStateMessageS2C | undefined> {
    // this thing is for "ready check state"
    const roomState = await this.qbus.execute<
      GetUserRoomQuery,
      GetUserRoomQueryResult
    >(new GetUserRoomQuery(steamId));
    if (!roomState.info) return undefined;

    return new PlayerRoomStateMessageS2C(
      roomState.info.roomId,
      roomState.info.mode,
      roomState.info.entries.map(
        (it) => new PlayerRoomEntry(it.steamId, it.readyState),
      ),
    );
  }

  async playerPartyInvitesState(
    steamId: string,
  ): Promise<PlayerPartyInvitationsMessageS2C> {
    const invitations = await this.qbus.execute<
      GetPartyInvitationsQuery,
      GetPartyInvitationsQueryResult
    >(new GetPartyInvitationsQuery(steamId));

    return new PlayerPartyInvitationsMessageS2C(
      await Promise.all(
        invitations.invitations.map(
          async (it) =>
            new PartyInviteReceivedMessageS2C(
              it.partyId,
              it.id,
              await this.user.userDto(it.leaderId),
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
    const res = await this.qbus.execute<
      GetQueueStateQuery,
      GetQueueStateQueryResult
    >(new GetQueueStateQuery(Dota2Version.Dota_684));

    return MatchmakingModes.map((mode) => {
      const inQueue = res.entries
        .filter((t) => t.modes.includes(mode))
        .reduce((a, b) => a + b.players.length, 0);

      return new QueueStateMessageS2C(mode, Dota2Version.Dota_684, inQueue);
    });
  }

  async playerQueueState(steamId: string) {
    const res = await this.qbus.execute<GetPartyQuery, GetPartyQueryResult>(
      new GetPartyQuery(steamId),
    );
    return new PlayerQueueStateMessageS2C(res.partyId, res.modes, res.inQueue);
  }
}
