import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  Configuration as FConfiguratin,
  ForumApi,
} from "../generated-api/forum";
import { PrometheusDriver } from "prometheus-query";
import {
  Configuration as MConfiguration,
  MatchmakerApi,
} from "../generated-api/matchmaker";
import {
  Configuration as TConfiguration,
  TradeApi,
} from "../generated-api/tradebot";

import * as http from "http";
import * as https from "https";
import {
  Configuration as TrConfiguration,
  TournamentApi,
} from "../generated-api/tournament";
import { ApiClient } from "@dota2classic/gs-api-generated/dist/module";
// Create a keep-alive agent for HTTP
const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });
const fetchProvider: typeof fetch = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => {
  return fetch(input, {
    ...init,
    keepalive: true,
    agent: (parsedURL) =>
      parsedURL.protocol === "https:" ? httpsAgent : httpAgent,
  } as RequestInit);
};

@Global()
@Module({
  providers: [
    {
      provide: PrometheusDriver,
      useFactory: (config: ConfigService) => {
        return new PrometheusDriver({
          endpoint: config.get("api.prometheusUrl"),
          baseURL: "/api/v1", // default value
        });
      },
      inject: [ConfigService],
    },
    {
      provide: ApiClient,
      useFactory: (config: ConfigService) => {
        const client = new ApiClient();
        client.configure(config.get("api.gameserverApiUrl"));
        return client;
      },
      inject: [ConfigService],
    },
    {
      provide: ForumApi,
      useFactory: (config: ConfigService) => {
        return new ForumApi(
          new FConfiguratin({
            basePath: config.get("api.forumApiUrl"),
            fetchApi: fetchProvider,
          }),
        );
      },
      inject: [ConfigService],
    },
    {
      provide: MatchmakerApi,
      useFactory: (config: ConfigService) => {
        return new MatchmakerApi(
          new MConfiguration({
            basePath: config.get("api.matchmakerApiUrl"),
            fetchApi: fetchProvider,
          }),
        );
      },
      inject: [ConfigService],
    },
    {
      provide: TradeApi,
      useFactory: (config: ConfigService) => {
        return new TradeApi(
          new TConfiguration({
            basePath: config.get("api.tradeApiUrl"),
            fetchApi: fetchProvider,
          }),
        );
      },
      inject: [ConfigService],
    },
    {
      provide: TournamentApi,
      useFactory: (config: ConfigService) => {
        return new TournamentApi(
          new TrConfiguration({
            basePath: config.get("api.tournamentApiUrl"),
            fetchApi: fetchProvider,
          }),
        );
      },
      inject: [ConfigService],
    },
  ],
  exports: [
    ApiClient,
    ForumApi,
    MatchmakerApi,
    TradeApi,
    TournamentApi,
    PrometheusDriver,
  ],
})
export class ApiModule {}
