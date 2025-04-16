import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Keyv from "keyv";
import KeyvRedis from "@keyv/redis";
import { UserUpdatedHandler } from "./event-handler/user-updated.handler";
import { UserProfileService } from "./service/user-profile.service";
import { CqrsModule } from "@nestjs/cqrs";
import { GameServerAdapter } from "./adapter/gameserver.adapter";
import { UserAdapter } from "./adapter/user.adapter";
import { UserCreatedHandler } from "./event-handler/user-created.handler";
import { MatchRecordedHandler } from "./event-handler/match-recorded.handler";
import { BanSystemHandler } from "./event-handler/ban-system.handler";
import { UserProfileModule as UMP } from "@dota2classic/caches";

@Module({
  imports: [
    CqrsModule,
    UMP.registerAsync({
      imports: [],
      useFactory(config: ConfigService) {
        return {
          host: config.get("redis.host"),
          password: config.get("redis.password"),
          port: 6379,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    GameServerAdapter,
    UserAdapter,
    UserUpdatedHandler,
    UserCreatedHandler,
    MatchRecordedHandler,
    BanSystemHandler,
    {
      provide: "full-profile",
      async useFactory(config: ConfigService) {
        return new Keyv(
          new KeyvRedis({
            url: `redis://${config.get("redis.host")}:6379`,
            password: config.get<string>("redis.password"),
          }),
          {
            namespace: "user-profile-full",
          },
        );
      },
      inject: [ConfigService],
    },
    {
      provide: "fast-user-profile",
      async useFactory(config: ConfigService) {
        return new Keyv(
          new KeyvRedis({
            url: `redis://${config.get("redis.host")}:6379`,
            password: config.get<string>("redis.password"),
          }),
          {
            namespace: "user-profile-fast",
          },
        );
      },
      inject: [ConfigService],
    },
    UserProfileService,
  ],
  exports: [UserProfileService],
})
export class UserProfileModule {}
