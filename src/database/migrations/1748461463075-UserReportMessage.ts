import { MigrationInterface, QueryRunner } from "typeorm";

export class UserReportMessage1748461463075 implements MigrationInterface {
  name = "UserReportMessage1748461463075";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_report" ADD "message_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_report" ADD CONSTRAINT "CHK_d29a1d9d78f8d90d8ed50eb3b8" CHECK (message_id is not null or match_id is not null)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_report" DROP CONSTRAINT "CHK_d29a1d9d78f8d90d8ed50eb3b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_report" DROP COLUMN "message_id"`,
    );
  }
}
