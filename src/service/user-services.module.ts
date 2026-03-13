import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { UserProfileModule } from "@dota2classic/caches";
import Keyv from "keyv";
import KeyvRedis from "@keyv/redis";
import { UserProfileDecorationPreferencesEntity } from "../entity/user-profile-decoration-preferences.entity";
import { StorageMapper } from "../storage/storage.mapper";
import { CustomizationMapper } from "../customization/customization.mapper";
import { UserProfileService } from "./user-profile.service";
import { PlayerFlagsEntity } from "../entity/player-flags.entity";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([UserProfileDecorationPreferencesEntity, PlayerFlagsEntity]),
    UserProfileModule.registerAsync({
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
    StorageMapper,
    CustomizationMapper,
    UserProfileService,
  ],
  exports: [UserProfileModule, StorageMapper, CustomizationMapper, UserProfileService],
})
export class UserServicesModule {}
