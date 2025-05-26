import { MigrationInterface, QueryRunner } from "typeorm";

export class UserRelation1748165080857 implements MigrationInterface {
  name = "UserRelation1748165080857";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_relation_status" AS ENUM('FRIEND', 'BLOCK')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_relation" ("steam_id" character varying NOT NULL, "related_steam_id" character varying NOT NULL, "relation" "public"."user_relation_status" NOT NULL, CONSTRAINT "PK_19699cb9ea18ddf0ba006df09b9" PRIMARY KEY ("steam_id", "related_steam_id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_relation"`);
    await queryRunner.query(`DROP TYPE "public"."user_relation_status"`);
  }
}
