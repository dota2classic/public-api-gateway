import { MigrationInterface, QueryRunner } from "typeorm";

export class LobbyBools1743769415376 implements MigrationInterface {
  name = "LobbyBools1743769415376";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lobby_entity" ADD "fill_bots" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "lobby_entity" ADD "enable_cheats" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification_entity" ALTER COLUMN "notification_type" SET DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_entity" ALTER COLUMN "ttl" SET DEFAULT '1 day'`,
    );
  }
}
