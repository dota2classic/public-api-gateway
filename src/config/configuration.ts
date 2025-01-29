import { readFileSync } from "fs";
import * as yaml from "js-yaml";
import { join } from "path";

const YAML_CONFIG_FILENAME = "config.yaml";

export interface ExpectedConfig {
  webpush: {
    publicKey: string;
    privateKey: string;
  };
  steam: {
    key: string;
  };
  redis: {
    host: string;
    password: string;
  };
  postgres: {
    host: string;
    username: string;
    password: string;
  };
  api: {
    liveMatchDelay: number;
    frontUrl: string;
    backUrl: string;

    gameserverApiUrl: string;
    forumApiUrl: string;
    jwtSecret: string;
  };
  telemetry: {
    jaeger: {
      url: string;
    };
    prometheus: {
      user: string;
      password: string;
    };
  };
  fluentbit: {
    host: string;
    port: number;
  };
}

export default (filename: string = YAML_CONFIG_FILENAME): ExpectedConfig => {
  return yaml.load(
    readFileSync(join("./", filename), "utf8"),
  ) as ExpectedConfig;
};
