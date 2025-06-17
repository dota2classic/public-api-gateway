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
    port: number;
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
  twitch: {
    secret: string;
    clientId: string;
  };
}

export default (): ExpectedConfig => {
  return {
    webpush: {
      publicKey: process.env.WEBPUSH_PUBLIC_KEY,
      privateKey: process.env.WEBPUSH_PRIVATE_KEY,
    },
    steam: {
      key: process.env.STEAM_API_KEY,
    },
    redis: {
      host: process.env.REDIS_HOST,
      password: process.env.REDIS_PASSWORD,
    },
    postgres: {
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT) || 5432,
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
    },
    api: {
      liveMatchDelay: parseInt(process.env.LIVE_MATCH_DELAY) || 5000,
      frontUrl: process.env.FRONTEND_URL,
      backUrl: process.env.BACKEND_URL,
      gameserverApiUrl: process.env.GAMESERVER_API,
      forumApiUrl: process.env.FORUM_API,
      s3root: process.env.S3ROOT,
      jwtSecret: process.env.JWT_SECRET,
      prometheusUrl: process.env.PROMETHEUS_URL,
    },
    telemetry: {
      jaeger: {
        url: "http://localhost",
      },
      prometheus: {
        user: process.env.PROMETHEUS_USER,
        password: process.env.PROMETHEUS_PASSWORD,
      },
    },
    fluentbit: {
      host: process.env.FLUENTBIT_HOST,
      application: process.env.APP_NAME,
      port: parseInt(process.env.FLUENTBIT_PORT) || 24224,
    },
    twitch: {
      secret: process.env.TWITCH_SECRET,
      clientId: process.env.TWITCH_CLIENT_ID,
    },
    telegram: {
      token: process.env.TELEGRAM_TOKEN,
    },
    s3: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
      accessKeySecret: process.env.S3_ACCESS_KEY_SECRET || "",
      endpoint: process.env.S3_ENDPOINT || "",
      bucket: process.env.S3_BUCKET || "",
      uploadPrefix: process.env.S3_UPLOAD_PREFIX || "",
    },
    rabbitmq: {
      host: "localhost",
      port: "5672",
      user: "guest",
      password: "guest",
      payment_queue: "payment_events",
    },
  } as ExpectedConfig;
};
