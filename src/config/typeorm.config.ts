import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";
import configuration from "./configuration";
import { Entities } from "../db.config";

const configService = new ConfigService(configuration("prod.config.yaml"));

const AppDataSource = new DataSource({
  type: "postgres",

  port: 5432,
  host: configService.get("postgres.host"),
  username: configService.get("postgres.username"),
  password: configService.get("postgres.password"),
  synchronize: false,
  entities: Entities,
  migrations: ["src/database/migrations/*.*"],
  migrationsRun: false,
  migrationsTableName: "api_gateway_migrations",
  logging: true,
});

export default AppDataSource;
