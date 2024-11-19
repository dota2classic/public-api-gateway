import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DB_HOST, DB_PASSWORD, DB_USERNAME } from "./utils/env";
import { MatchmakingModeStatusEntity } from "./entity/matchmaking-mode-status.entity";
import { WebpushSubscriptionEntity } from "./entity/webpush-subscription.entity";

export const Entities = [
  MatchmakingModeStatusEntity,
  WebpushSubscriptionEntity,
];

export const prodDbConfig: TypeOrmModuleOptions = {
  type: "postgres",
  database: "postgres",
  host: DB_HOST(),
  port: 5432,
  username: DB_USERNAME(),
  password: DB_PASSWORD,
  entities: Entities,
  synchronize: true,

  ssl: false,
};
