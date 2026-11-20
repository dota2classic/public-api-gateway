import { IncomingMessage, ServerResponse } from "http";
import { ConfigService } from "@nestjs/config";
import { Params } from "nestjs-pino";
import { LevelWithSilent } from "pino";
import { StdSerializedResults } from "pino-http";
import { API_PREFIX } from "./api-prefix";

const QUIET_ROUTES = new Set(
  ["live/list", "stats/online", "stats/matchmaking", "stats/twitch", "player/party"].map(
    (route) => `/${API_PREFIX}/${route}`,
  ),
);

const pathOf = (url: string): string => {
  const query = url.indexOf("?");
  return query === -1 ? url : url.slice(0, query);
};

const levelOf = (req: IncomingMessage, res: ServerResponse, err?: Error): LevelWithSilent => {
  if (err || res.err || res.statusCode >= 500) return "error";
  if (QUIET_ROUTES.has(pathOf(req.url))) return "silent";
  return res.statusCode >= 400 ? "warn" : "info";
};

const serializeRequest = (req: StdSerializedResults["req"]) => ({
  id: req.id,
  method: req.method,
  url: req.url,
  headers: {
    "user-agent": req.headers["user-agent"],
    "x-real-ip": req.headers["x-real-ip"],
  },
});

const serializeResponse = (res: StdSerializedResults["res"]) => ({
  statusCode: res.statusCode,
});

export const getLoggerParams = (config: ConfigService): Params => ({
  pinoHttp: {
    level: process.env.LOG_LEVEL || "info",
    transport: config.get<boolean>("api.production")
      ? undefined
      : { target: "pino-pretty", options: { colorize: true, singleLine: true } },
    customLogLevel: levelOf,
    serializers: { req: serializeRequest, res: serializeResponse },
  },
});
