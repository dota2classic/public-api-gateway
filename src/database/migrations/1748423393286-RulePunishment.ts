import { MigrationInterface, QueryRunner } from "typeorm";

export class RulePunishment1748423393286 implements MigrationInterface {
  name = "RulePunishment1748423393286";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rule_punishment" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "duration_hours" integer NOT NULL, CONSTRAINT "PK_d4ac1b7c3cf8d24853293b2ef72" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "rule_entity" ADD "punishment_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "rule_entity" ADD CONSTRAINT "FK_6a275a463586467833f407f6133" FOREIGN KEY ("punishment_id") REFERENCES "rule_punishment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rule_entity" DROP CONSTRAINT "FK_6a275a463586467833f407f6133"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rule_entity" DROP COLUMN "punishment_id"`,
    );
    await queryRunner.query(`DROP TABLE "rule_punishment"`);
  }
}
