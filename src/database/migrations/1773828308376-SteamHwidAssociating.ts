import { MigrationInterface, QueryRunner } from "typeorm";

export class SteamHwidAssociating1773828308376 implements MigrationInterface {
  name = "SteamHwidAssociating1773828308376";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "steamid_hwid_entry" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "steam_id" character varying NOT NULL, "hwid" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_fd7bdbaad496d5ddf7a766abec8" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "steamid_hwid_entry"`);
  }
}
