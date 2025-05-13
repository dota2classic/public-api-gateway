import { MigrationInterface, QueryRunner } from "typeorm";

export class IconId1747117911802 implements MigrationInterface {
  name = "IconId1747117911802";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_profile_decoration_preferences" ADD "icon_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profile_decoration_preferences" ADD CONSTRAINT "FK_857cedf864b3fc8aa86dfa48c90" FOREIGN KEY ("icon_id") REFERENCES "user_profile_decoration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_profile_decoration_preferences" DROP CONSTRAINT "FK_857cedf864b3fc8aa86dfa48c90"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profile_decoration_preferences" DROP COLUMN "icon_id"`,
    );
  }
}
