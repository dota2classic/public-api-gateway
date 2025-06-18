import { Injectable, Logger } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { WebSocketServer } from "@nestjs/websockets";
import { Server as WSServer } from "socket.io";
import {
  PlayerRoomEntry,
  PlayerRoomStateMessageS2C,
} from "./messages/s2c/player-room-state-message.s2c";
import { GetPartyInvitationsQuery } from "../gateway/queries/GetPartyInvitations/get-party-invitations.query";
import { GetPartyInvitationsQueryResult } from "../gateway/queries/GetPartyInvitations/get-party-invitations-query.result";
import { PlayerPartyInvitationsMessageS2C } from "./messages/s2c/player-party-invitations-message.s2c";
import { PartyInviteReceivedMessageS2C } from "./messages/s2c/party-invite-received-message.s2c";
import { PlayerGameStateMessageS2C } from "./messages/s2c/player-game-state-message.s2c";
import { GetQueueStateQuery } from "../gateway/queries/QueueState/get-queue-state.query";
import { GetQueueStateQueryResult } from "../gateway/queries/QueueState/get-queue-state-query.result";
import { Dota2Version } from "../gateway/shared-types/dota2version";
import { MatchmakingModes } from "../gateway/shared-types/matchmaking-mode";
import { QueueStateMessageS2C } from "./messages/s2c/queue-state-message.s2c";
import { PlayerQueueStateMessageS2C } from "./messages/s2c/player-queue-state-message.s2c";
import { UserProfileService } from "../service/user-profile.service";
import { PartyService } from "../rest/party.service";
import { MatchmakerApi } from "../generated-api/matchmaker";
import { ReadyState } from "../gateway/events/ready-state-received.event";
import { PlayerApi } from "../generated-api/gameserver";

@Injectable()
export class SocketMessageService {
  @WebSocketServer()
  public server: WSServer;

  private readonly logger = new Logger(SocketMessageService.name);

  constructor(
    private readonly qbus: QueryBus,
    private readonly user: UserProfileService,
    private readonly party: PartyService,
    private readonly mmApi: MatchmakerApi,
    private readonly playerApi: PlayerApi,
  ) {}

  async playerRoomState(
    steamId: string,
  ): Promise<PlayerRoomStateMessageS2C | undefined> {
    const roomStateInfo =
      await this.mmApi.matchmakerApiControllerGetUserRoom(steamId);

    // this thing is for "ready check state"
    if (!roomStateInfo) return undefined;

    return new PlayerRoomStateMessageS2C(
      roomStateInfo.roomId,
      roomStateInfo.mode,
      roomStateInfo.entries.map(
        (it) =>
          new PlayerRoomEntry(
            it.steamId,
            it.readyState as unknown as ReadyState,
          ),
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
    const res = await this.playerApi.playerControllerPlayerSummary(steamId);
    if (!res.session) return undefined;

    return new PlayerGameStateMessageS2C(res.session.serverUrl);
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
    const res = await this.party.getPartyRaw(steamId);
    return new PlayerQueueStateMessageS2C(res.partyId, res.modes, res.inQueue);
  }
}
