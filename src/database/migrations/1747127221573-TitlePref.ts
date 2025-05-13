import { MigrationInterface, QueryRunner } from "typeorm";

export class TitlePref1747127221573 implements MigrationInterface {
  name = "TitlePref1747127221573";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_profile_decoration_preferences" ADD "title_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profile_decoration_preferences" ADD CONSTRAINT "FK_0b60eff6f7c142df1069e125f5f" FOREIGN KEY ("title_id") REFERENCES "user_profile_decoration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_profile_decoration_preferences" DROP CONSTRAINT "FK_0b60eff6f7c142df1069e125f5f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profile_decoration_preferences" DROP COLUMN "title_id"`,
    );
  }
}
