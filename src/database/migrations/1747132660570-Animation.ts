import { MigrationInterface, QueryRunner } from "typeorm";

export class Animation1747132660570 implements MigrationInterface {
  name = "Animation1747132660570";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_profile_decoration_preferences" ADD "animation_id" integer`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."user_profile_decoration_type" RENAME TO "user_profile_decoration_type_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_profile_decoration_type" AS ENUM('HAT', 'TITLE', 'CHAT_ICON', 'CHAT_ICON_ANIMATION')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profile_decoration" ALTER COLUMN "decoration_type" TYPE "public"."user_profile_decoration_type" USING "decoration_type"::"text"::"public"."user_profile_decoration_type"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."user_profile_decoration_type_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profile_decoration_preferences" ADD CONSTRAINT "FK_03597be25f66ffd7b9055f7ed32" FOREIGN KEY ("animation_id") REFERENCES "user_profile_decoration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_profile_decoration_preferences" DROP CONSTRAINT "FK_03597be25f66ffd7b9055f7ed32"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_profile_decoration_type_old" AS ENUM('HAT', 'TITLE', 'CHAT_ICON')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profile_decoration" ALTER COLUMN "decoration_type" TYPE "public"."user_profile_decoration_type_old" USING "decoration_type"::"text"::"public"."user_profile_decoration_type_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."user_profile_decoration_type"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."user_profile_decoration_type_old" RENAME TO "user_profile_decoration_type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profile_decoration_preferences" DROP COLUMN "animation_id"`,
    );
  }
}
