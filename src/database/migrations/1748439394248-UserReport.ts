import { MigrationInterface, QueryRunner } from "typeorm";

export class UserReport1748439394248 implements MigrationInterface {
  name = "UserReport1748439394248";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_report" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "reporter_steam_id" character varying NOT NULL, "reported_steam_id" character varying NOT NULL, "rule_id" integer NOT NULL, "match_id" integer, "comment" character varying NOT NULL DEFAULT '', CONSTRAINT "PK_58c08f0e20fa66561b119421eb2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_report" ADD CONSTRAINT "FK_b3d865a19136bb877050ce455d0" FOREIGN KEY ("rule_id") REFERENCES "rule_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_report" DROP CONSTRAINT "FK_b3d865a19136bb877050ce455d0"`,
    );
    await queryRunner.query(`DROP TABLE "user_report"`);
  }
}
