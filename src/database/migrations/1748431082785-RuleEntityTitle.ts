import { MigrationInterface, QueryRunner } from "typeorm";

export class RuleEntityTitle1748431082785 implements MigrationInterface {
  name = "RuleEntityTitle1748431082785";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rule_entity" ADD "title" character varying NOT NULL DEFAULT 'Правило'`,
    );
    await queryRunner.query(
      `ALTER TABLE "rule_entity" ALTER COLUMN "description" SET DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rule_entity" ALTER COLUMN "description" DROP DEFAULT`,
    );
    await queryRunner.query(`ALTER TABLE "rule_entity" DROP COLUMN "title"`);
  }
}
