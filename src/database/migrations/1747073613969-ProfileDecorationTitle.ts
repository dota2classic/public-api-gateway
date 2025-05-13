import { MigrationInterface, QueryRunner } from "typeorm";

export class ProfileDecorationTitle1747073613969 implements MigrationInterface {
  name = "ProfileDecorationTitle1747073613969";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_profile_decoration" ADD "title" character varying NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_profile_decoration" DROP COLUMN "title"`,
    );
  }
}
