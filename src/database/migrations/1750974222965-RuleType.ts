import { MigrationInterface, QueryRunner } from "typeorm";

export class RuleType1750974222965 implements MigrationInterface {
  name = "RuleType1750974222965";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."rule_type" AS ENUM('GAMEPLAY', 'COMMUNICATION')`,
    );
    await queryRunner.query(
      `ALTER TABLE "rule_entity" ADD "rule_type" "public"."rule_type" NOT NULL DEFAULT 'GAMEPLAY'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rule_entity" DROP COLUMN "rule_type"`,
    );
    await queryRunner.query(`DROP TYPE "public"."rule_type"`);
  }
}
