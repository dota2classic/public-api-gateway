import { MigrationInterface, QueryRunner } from "typeorm";

export class PlayerFlags1744450904168 implements MigrationInterface {
  name = "PlayerFlags1744450904168";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "player_flags" ("steam_id" character varying NOT NULL, "ignore_smurf_alert" boolean NOT NULL, CONSTRAINT "PK_6b9f48002b7d13ddeef98783fc1" PRIMARY KEY ("steam_id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "player_flags"`);
  }
}
