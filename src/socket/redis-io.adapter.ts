import { IoAdapter } from "@nestjs/platform-socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import { ServerOptions } from "socket.io";
import { ConfigService } from "@nestjs/config";
import { INestApplication } from "@nestjs/common";

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  constructor(
    private readonly app: INestApplication,
    private readonly config: ConfigService,
  ) {
    super(app);
  }

  async connectToRedis(): Promise<void> {
    const pubClient = createClient({
      url: `redis://${this.config.get("redis.host")}:6379`,
      password: this.config.get("redis.password"),
    });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
