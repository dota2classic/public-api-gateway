import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { ClientType, PlayerSocket } from "./player.socket";
import { JwtService } from "@nestjs/jwt";
import { Server as WSServer } from "socket.io";
import { SocketMessageService } from "./socket-message.service";
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
import { PlayerEnterQueueRequestedEvent } from "../gateway/events/mm/player-enter-queue-requested.event";
import { PlayerLeaveQueueRequestedEvent } from "../gateway/events/mm/player-leave-queue-requested.event";
import { Cron, CronExpression, Interval } from "@nestjs/schedule";
import { MetricsService } from "../metrics/metrics.service";
import { UserRelationService } from "../service/user-relation.service";
import { UserRelationStatus } from "../gateway/shared-types/user-relation";
import { OnlineUpdateMessageS2C } from "./messages/s2c/online-update-message.s2c";
import { PlayerBanService } from "../service/player-ban.service";
import { OnlinePresenceService } from "./online-presence.service";
import { StatsService } from "../stats/stats.service";

const ONLINE_UPDATE_DELAY_MS = 3_000;
const IN_GAME_CHECK_MS = 15_000;

@WebSocketGateway({ cors: "*" })
export class SocketGateway implements OnGatewayDisconnect, OnGatewayConnection {
  private logger = new Logger(SocketGateway.name);

  @WebSocketServer()
  server: WSServer;

  constructor(
    private readonly jwtService: JwtService,
    private readonly messageService: SocketMessageService,
    private readonly playerBan: PlayerBanService,
    @Inject("QueryCore") private readonly redisQueue: ClientProxy,
    private readonly metrics: MetricsService,
    private readonly relationService: UserRelationService,
    private readonly presence: OnlinePresenceService,
    private readonly stats: StatsService,
  ) {}

  private onlineUpdateTimer?: NodeJS.Timeout;
  private lastInGame?: number;

  async handleConnection(client: PlayerSocket, ...args) {
    const authToken = client.handshake.auth?.token;
    const clientTypeRaw = client.handshake.auth?.clientType ?? client.handshake.query?.clientType;
    client.clientType = clientTypeRaw === ClientType.LAUNCHER ? ClientType.LAUNCHER : ClientType.WEBAPP;

    try {
      const parsed = this.jwtService.verify<{ sub: string }>(authToken);

      client.steamId = parsed.sub;
      // this.stopDisconnectCountdown(client);

      await this.onConnect(client);
      this.scheduleOnlineUpdate();
      await this.shareInitialData(client);
    } catch (e) {
      client.steamId = undefined;
    }

    await this.onlineUpdate()
      .then((message) => client.emit(MessageTypeS2C.ONLINE_UPDATE, message))
      .catch((e) => this.logger.error("Initial online update failed", e));
  }

  async handleDisconnect(client: PlayerSocket) {
    if (await this.presence.disconnect(client)) {
      this.scheduleOnlineUpdate();
    }
  }

  @SubscribeMessage(MessageTypeC2S.ENTER_QUEUE)
  async onEnterQueue(
    @MessageBody() data: EnterQueueMessageC2S,
    @ConnectedSocket() client: PlayerSocket,
  ) {
    if (!client.steamId || !Array.isArray(data?.modes)) return;
    await this.redisQueue
      .emit(
        PlayerEnterQueueRequestedEvent.name,
        new PlayerEnterQueueRequestedEvent(client.steamId, data.modes),
      )
      .toPromise();
  }

  @SubscribeMessage(MessageTypeC2S.LEAVE_ALL_QUEUES)
  async leaveAllQueues(@ConnectedSocket() client: PlayerSocket) {
    await this.redisQueue
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
    this.redisQueue.emit(
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
    if (await this.playerBan.isPermabanned(client.steamId)) {
      return;
    }

    const rel = await this.relationService.getRelation(
      data.invitedPlayerId,
      client.steamId,
    );
    if (rel === UserRelationStatus.BLOCK) {
      this.logger.log("Prevent inviting player to party: blocked", {
        steamId: data.invitedPlayerId,
        inviter: client.steamId,
      });
      return;
    }
    await this.redisQueue
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
    await this.redisQueue
      .emit(
        PartyInviteAcceptedEvent.name,
        new PartyInviteAcceptedEvent(data.inviteId, data.accept),
      )
      .toPromise();
  }

  @SubscribeMessage(MessageTypeC2S.LEAVE_PARTY)
  async leaveParty(@ConnectedSocket() client: PlayerSocket) {
    await this.redisQueue
      .emit(
        PartyLeaveRequestedEvent.name,
        new PartyLeaveRequestedEvent(client.steamId),
      )
      .toPromise();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  public async collectMetrics() {
    const steamIds = await this.presence.steamIds();
    this.metrics.recordOnline(steamIds.length);
  }

  @Interval(IN_GAME_CHECK_MS)
  public async checkInGame() {
    const inGame = await this.readInGame();
    if (inGame !== undefined && inGame !== this.lastInGame) {
      this.scheduleOnlineUpdate();
    }
  }

  private scheduleOnlineUpdate() {
    if (this.onlineUpdateTimer) return;
    this.onlineUpdateTimer = setTimeout(() => {
      this.onlineUpdateTimer = undefined;
      this.broadcastOnline().catch((e) => this.logger.error("Online update failed", e));
    }, ONLINE_UPDATE_DELAY_MS);
  }

  private async broadcastOnline() {
    const message = await this.onlineUpdate();
    this.logger.log("Online update", { authorized: message.online.length });
    this.server.emit(MessageTypeS2C.ONLINE_UPDATE, message);
  }

  private async onlineUpdate(): Promise<OnlineUpdateMessageS2C> {
    const [{ steamIds, clients }, inGame] = await Promise.all([
      this.presence.clients(),
      this.readInGame(),
    ]);
    this.lastInGame = inGame ?? this.lastInGame;
    return new OnlineUpdateMessageS2C(steamIds, steamIds.length, clients, this.lastInGame);
  }

  private async readInGame(): Promise<number | undefined> {
    try {
      return (await this.stats.currentOnline()).inGame;
    } catch (e) {
      this.logger.warn("Could not read in-game count", e);
      return undefined;
    }
  }

  private async onConnect(socket: PlayerSocket) {
    if (!socket.steamId) {
      return;
    }

    const refresh = () =>
      this.presence
        .refresh(socket)
        .catch((e) => this.logger.warn("Presence refresh failed", e));

    socket.conn.on("packet", (packet) => {
      if (packet.type === "pong") {
        refresh();
      }
    });

    socket.onAny(refresh);
    await this.presence.connect(socket);
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
}
