import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DB_HOST, DB_PASSWORD, DB_USERNAME } from './utils/env';
import { MatchmakingModeStatusEntity } from './entity/matchmaking-mode-status.entity';

export const Entities = [
  MatchmakingModeStatusEntity
];
export const devDbConfig: any = {
  type: 'postgres',
  database: 'postgres',
  host: 'localhost',
  port: 5400,
  username: 'postgres',
  password: 'docker',
  entities: Entities,
  synchronize: true,

  keepConnectionAlive: true,
};

export const testDbConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: ':memory:',
  entities: Entities,
  synchronize: true,
  keepConnectionAlive: true,
  dropSchema: true,
};

export const prodDbConfig: any = {
  type: 'postgres',
  database: 'postgres',
  host: DB_HOST(),
  port: 5432,
  username: DB_USERNAME(),
  password: DB_PASSWORD,
  entities: Entities,
  synchronize: true,

  ssl: false,
};
