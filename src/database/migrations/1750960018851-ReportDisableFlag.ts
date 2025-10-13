import { MigrationInterface, QueryRunner } from "typeorm";

export class ReportDisableFlag1750960018851 implements MigrationInterface {
  name = "ReportDisableFlag1750960018851";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "player_flags" ADD "disable_reports" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "player_flags" DROP COLUMN "disable_reports"`,
    );
  }
}
