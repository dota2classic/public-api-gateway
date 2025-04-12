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

@Module({
  imports: [CqrsModule],
  providers: [
    GameServerAdapter,
    UserAdapter,
    UserUpdatedHandler,
    UserCreatedHandler,
    MatchRecordedHandler,
    BanSystemHandler,
    {
      provide: Keyv,
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
    UserProfileService,
  ],
  exports: [UserProfileService],
})
export class UserProfileModule {}
