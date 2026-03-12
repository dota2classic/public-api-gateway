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
import { Cron, CronExpression } from "@nestjs/schedule";
import { MetricsService } from "../metrics/metrics.service";
import { UserRelationService } from "../service/user-relation.service";
import { UserRelationStatus } from "../gateway/shared-types/user-relation";
import Redis from "ioredis";
import { OnlineEntry, OnlineUpdateMessageS2C } from "./messages/s2c/online-update-message.s2c";
import { PlayerBanService } from "../service/player-ban.service";

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
    @Inject("REDIS") private readonly redis: Redis,
  ) {}

  async handleConnection(client: PlayerSocket, ...args) {
    const authToken = client.handshake.auth?.token;
    const clientTypeRaw = client.handshake.auth?.clientType ?? client.handshake.query?.clientType;
    client.clientType = clientTypeRaw === ClientType.LAUNCHER ? ClientType.LAUNCHER : ClientType.WEBAPP;

    try {
      const parsed = this.jwtService.verify<{ sub: string }>(authToken);

      client.steamId = parsed.sub;
      // this.stopDisconnectCountdown(client);

      await this.onConnect(client);
      await this.shareInitialData(client);
    } catch (e) {
      client.steamId = undefined;
    }

    await this.updateOnline();
  }

  async handleDisconnect(client: PlayerSocket) {
    if (client.steamId) {
      await this.onDisconnect(client);
    }

    await this.updateOnline();
  }

  @SubscribeMessage(MessageTypeC2S.ENTER_QUEUE)
  async onEnterQueue(
    @MessageBody() data: EnterQueueMessageC2S,
    @ConnectedSocket() client: PlayerSocket,
  ) {
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
    this.metrics.recordOnline(await this.getOnlineUsers());
  }

  public async getOnlineSteamIds() {
    const { steamIds } = await this.getOnlineClients();
    return steamIds;
  }

  public async getClientType(steamId: string): Promise<ClientType> {
    const hasLauncher = await this.redis.exists(
      `connected_steamId:${steamId}:${ClientType.LAUNCHER}`,
    );
    return hasLauncher ? ClientType.LAUNCHER : ClientType.WEBAPP;
  }

  private async updateOnline() {
    const { steamIds, clients } = await this.getOnlineClients();
    this.logger.log("Online update", {
      authorized: steamIds.length,
    });
    this.server.emit(
      MessageTypeS2C.ONLINE_UPDATE,
      new OnlineUpdateMessageS2C(steamIds, steamIds.length, clients) as any,
    );
  }

  private async getOnlineClients(): Promise<{
    steamIds: string[];
    clients: OnlineEntry[];
  }> {
    const steamKeys: string[] = await this.redis.keys("connected_steamId:*");
    // Each key is connected_steamId:{steamId}:{clientType}
    // A steamId may have both types; launcher takes priority in the clients list
    const byId = new Map<string, ClientType>();
    for (const key of steamKeys) {
      const [steamId, clientType] = key
        .replace("connected_steamId:", "")
        .split(":");
      // Only upgrade to launcher, never downgrade
      if (!byId.has(steamId) || clientType === ClientType.LAUNCHER) {
        byId.set(steamId, clientType as ClientType);
      }
    }
    const clients: OnlineEntry[] = Array.from(byId.entries()).map(
      ([steamId, clientType]) => ({ steamId, clientType }),
    );
    return { steamIds: clients.map((c) => c.steamId), clients };
  }

  private async onConnect(socket: PlayerSocket) {
    const steamId = socket.steamId;
    if (!steamId) {
      return;
    }

    const ping = (steamId: string, clientType: ClientType) => {
      const key = `connected_steamId:${steamId}:${clientType}`;
      return this.redis.multi().set(key, "1").expire(key, 120).exec();
    };

    socket.conn.on("packet", (packet) => {
      if (packet.type === "pong") {
        ping(steamId, socket.clientType);
      }
    });

    socket.onAny(() => ping(steamId, socket.clientType));
    await ping(steamId, socket.clientType);
  }

  private async onDisconnect(socket: PlayerSocket) {
    if (socket.steamId) {
      await this.redis.del(
        `connected_steamId:${socket.steamId}:${socket.clientType}`,
      );
    }
  }

  private async getOnlineUsers(): Promise<number> {
    return this.redis.scard("connected_steamId:*");
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
