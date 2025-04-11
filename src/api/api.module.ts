import { Global, Module } from "@nestjs/common";
import {
  Configuration as GSConfiguration,
  CrimeApi,
  InfoApi,
  MatchApi,
  MetaApi,
  PlayerApi,
  RecordApi,
} from "../generated-api/gameserver";
import { ConfigService } from "@nestjs/config";
import {
  Configuration as FConfiguratin,
  ForumApi,
} from "../generated-api/forum";

@Global()
@Module({
  providers: [
    {
      provide: MatchApi,
      useFactory: (config: ConfigService) => {
        return new MatchApi(
          new GSConfiguration({ basePath: config.get("api.gameserverApiUrl") }),
        );
      },
      inject: [ConfigService],
    },
    {
      provide: MetaApi,
      useFactory: (config: ConfigService) => {
        return new MetaApi(
          new GSConfiguration({ basePath: config.get("api.gameserverApiUrl") }),
        );
      },
      inject: [ConfigService],
    },
    {
      provide: CrimeApi,
      useFactory: (config: ConfigService) => {
        return new CrimeApi(
          new GSConfiguration({ basePath: config.get("api.gameserverApiUrl") }),
        );
      },
      inject: [ConfigService],
    },
    {
      provide: PlayerApi,
      useFactory: (config: ConfigService) => {
        return new PlayerApi(
          new GSConfiguration({ basePath: config.get("api.gameserverApiUrl") }),
        );
      },
      inject: [ConfigService],
    },
    {
      provide: InfoApi,
      useFactory: (config: ConfigService) => {
        return new InfoApi(
          new GSConfiguration({ basePath: config.get("api.gameserverApiUrl") }),
        );
      },
      inject: [ConfigService],
    },
    {
      provide: RecordApi,
      useFactory: (config: ConfigService) => {
        return new RecordApi(
          new GSConfiguration({ basePath: config.get("api.gameserverApiUrl") }),
        );
      },
      inject: [ConfigService],
    },
    {
      provide: ForumApi,
      useFactory: (config: ConfigService) => {
        return new ForumApi(
          new FConfiguratin({ basePath: config.get("api.forumApiUrl") }),
        );
      },
      inject: [ConfigService],
    },
  ],
  exports: [
    MatchApi,
    MetaApi,
    CrimeApi,
    PlayerApi,
    InfoApi,
    RecordApi,
    ForumApi,
  ],
})
export class ApiModule {}
