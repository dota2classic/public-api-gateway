import { MigrationInterface, QueryRunner } from "typeorm";

export class AutomaticRules1748811462178 implements MigrationInterface {
  name = "AutomaticRules1748811462178";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rule_entity" ADD "automatic" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rule_entity" DROP COLUMN "automatic"`,
    );
  }
}
