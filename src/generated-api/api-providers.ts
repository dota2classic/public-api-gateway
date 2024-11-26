import { FactoryProvider } from "@nestjs/common";
import { Configuration, PlayerApi } from "./gameserver";
import { GAMESERVER_APIURL } from "../utils/env";

// TODO: Refactor via config service
export const PlayerAPIProvider: FactoryProvider<PlayerApi> = {
  provide: PlayerApi,
  useFactory() {
    return new PlayerApi(
      new Configuration({ basePath: `http://${GAMESERVER_APIURL}` }),
    );
  },
};
