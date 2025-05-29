import { MigrationInterface, QueryRunner } from "typeorm";

export class PunishmentLog1748514090591 implements MigrationInterface {
  name = "PunishmentLog1748514090591";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "punishment_log" ("id" SERIAL NOT NULL, "rule_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "ban_duration_seconds" integer NOT NULL, "report_id" uuid, "punishment_id" integer, "reported" character varying NOT NULL, "executor" character varying NOT NULL, CONSTRAINT "REL_2d1013045d04ca9e6e29b7e133" UNIQUE ("report_id"), CONSTRAINT "PK_575d64625689f4ab69a2eaeeeda" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_report" ADD "handled" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_report" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "punishment_log" ADD CONSTRAINT "FK_fb74930ca8417a176abaa2a8199" FOREIGN KEY ("rule_id") REFERENCES "rule_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "punishment_log" ADD CONSTRAINT "FK_2d1013045d04ca9e6e29b7e1333" FOREIGN KEY ("report_id") REFERENCES "user_report"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "punishment_log" ADD CONSTRAINT "FK_cd023e8bf6b590e457a445e1ab3" FOREIGN KEY ("punishment_id") REFERENCES "rule_punishment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "punishment_log" DROP CONSTRAINT "FK_cd023e8bf6b590e457a445e1ab3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "punishment_log" DROP CONSTRAINT "FK_2d1013045d04ca9e6e29b7e1333"`,
    );
    await queryRunner.query(
      `ALTER TABLE "punishment_log" DROP CONSTRAINT "FK_fb74930ca8417a176abaa2a8199"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_report" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(`ALTER TABLE "user_report" DROP COLUMN "handled"`);
    await queryRunner.query(`DROP TABLE "punishment_log"`);
  }
}
