import { MigrationInterface, QueryRunner } from "typeorm";

export class PatchInLobby1754990102640 implements MigrationInterface {
  name = "PatchInLobby1754990102640";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."lobby_entity_patch_enum" AS ENUM('DOTA_684', 'DOTA_684_TURBO')`,
    );
    await queryRunner.query(
      `ALTER TABLE "lobby_entity" ADD "patch" "public"."lobby_entity_patch_enum" NOT NULL DEFAULT 'DOTA_684'`,
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
