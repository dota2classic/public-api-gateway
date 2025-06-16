import { MigrationInterface, QueryRunner } from "typeorm";

export class Maintenance1750069879793 implements MigrationInterface {
  name = "Maintenance1750069879793";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "maintenance" ("id" SERIAL NOT NULL, "active" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_542fb6a28537140d2df95faa52a" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "maintenance"`);
  }
}
