import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApisauceInstance, create } from "apisauce";
import * as qs from "qs";
import { Cron, CronExpression } from "@nestjs/schedule";
import { QueryBus } from "@nestjs/cqrs";
import { GetAllConnectionsQuery } from "../gateway/queries/GetAllConnections/get-all-connections.query";
import { UserConnection } from "../gateway/shared-types/user-connection";
import { GetAllConnectionsQueryResult } from "../gateway/queries/GetAllConnections/get-all-connections-query.result";

interface StreamInfo {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  game_id: string;
  game_name: string;
  type: string;
  title: string;
  viewer_count: number;
  started_at: string;
  language: string;
  thumbnail_url: string;
  tag_ids: any[];
  tags: string[];
  is_mature: boolean;
}

export interface FullStreamInfo {
  stream: StreamInfo;
  steamId: string;
}

@Injectable()
export class TwitchService implements OnApplicationBootstrap {
  private _streams: FullStreamInfo[] = [];
  private logger = new Logger(TwitchService.name);

  private oauth: ApisauceInstance;
  private helix: ApisauceInstance;
  private token?: string;

  get streams(): FullStreamInfo[] {
    return this._streams;
  }

  constructor(
    private readonly config: ConfigService,
    private readonly qbus: QueryBus,
  ) {
    this.oauth = create({
      baseURL: "https://id.twitch.tv",
    });
    this.helix = create({
      baseURL: "https://api.twitch.tv/helix",
    });

    this.helix.setHeader("Client-id", this.config.get("twitch.clientId"));
  }

  async onApplicationBootstrap() {
    await this.refreshToken();
    // await this.fetchLivestreams();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  private async fetchLivestreams() {
    // return
    try {
      this._streams = await this.getLiveStreamingDota();
    } catch (e) {
      this.logger.error("Error getting live streaming data", e);
    }
  }

  private async getLiveStreamingDota(): Promise<FullStreamInfo[]> {
    const res = await this.qbus.execute<
      GetAllConnectionsQuery,
      GetAllConnectionsQueryResult
    >(new GetAllConnectionsQuery(UserConnection.TWITCH));

    const streams = await this.getDotaStreams(
      res.entries.map((it) => it.externalId),
    );

    if (streams.length == 0) {
      return [];
    }

    return streams.map((stream) => ({
      stream,
      steamId: res.entries.find((t) => t.externalId === stream.user_login)?.id
        .value,
    }));
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  private async refreshToken() {
    const token = await this.oauth.post<{
      access_token: string;
      expires_in: number;
      token_type: "bearer";
    }>(
      "/oauth2/token",
      qs.stringify({
        client_id: this.config.get("twitch.clientId"),
        client_secret: this.config.get("twitch.secret"),
        grant_type: "client_credentials",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    if (token.ok) {
      this.token = token.data.access_token;
      this.helix.setHeader("Authorization", `Bearer ${this.token}`);
      this.logger.log("Successfully updated token");
    }
  }

  private async getDotaStreams(
    twitchUsernames: string[],
  ): Promise<StreamInfo[]> {
    const response = await this.helix.get<{ data: StreamInfo[] }>(
      `streams?${this.getParams("user_login", twitchUsernames)}&game_id=${29595}&type=live`,
    );
    if (!response.ok) {
      this.logger.error(
        "Couldn't get live streams from twitch!",
        response.originalError,
      );
      return [];
    }
    return response.data.data.filter((stream) =>
      stream.title.toLowerCase().includes("dotaclassic.ru"),
    );
  }

  private getParams(name: string, values: string[]) {
    return values.map((t) => `${name}=${t}`).join("&");
  }
}
