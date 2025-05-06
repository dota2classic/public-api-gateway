import { MigrationInterface, QueryRunner } from "typeorm";

export class UserPreferences1746527794207 implements MigrationInterface {
  name = "UserPreferences1746527794207";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_profile_decoration_preferences" ("steam_id" character varying NOT NULL, "hat_id" integer, CONSTRAINT "PK_9ec769fd2e34c89f9a096f4cde5" PRIMARY KEY ("steam_id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_profile_decoration_type" AS ENUM('HAT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_profile_decoration" ("id" SERIAL NOT NULL, "decoration_type" "public"."user_profile_decoration_type" NOT NULL, "image_key" character varying NOT NULL, CONSTRAINT "PK_0168ed555fa7970d36ce190e9e3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profile_decoration_preferences" ADD CONSTRAINT "FK_9b4e781db5326680e374cf23f24" FOREIGN KEY ("hat_id") REFERENCES "user_profile_decoration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_profile_decoration_preferences" DROP CONSTRAINT "FK_9b4e781db5326680e374cf23f24"`,
    );
    await queryRunner.query(`DROP TABLE "user_profile_decoration"`);
    await queryRunner.query(
      `DROP TYPE "public"."user_profile_decoration_type"`,
    );
    await queryRunner.query(`DROP TABLE "user_profile_decoration_preferences"`);
  }
}
