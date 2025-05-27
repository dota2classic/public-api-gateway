import { MigrationInterface, QueryRunner } from "typeorm";

export class RuleEntity1748269181483 implements MigrationInterface {
  name = "RuleEntity1748269181483";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rule_entity" ("id" SERIAL NOT NULL, "index" smallint NOT NULL, "description" character varying NOT NULL, "parent_id" integer, CONSTRAINT "PK_522a2134d8b4453d5e30c0a7fbf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "rule_entity" ADD CONSTRAINT "FK_90ae657a1454dec404768317250" FOREIGN KEY ("parent_id") REFERENCES "rule_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rule_entity" DROP CONSTRAINT "FK_90ae657a1454dec404768317250"`,
    );
    await queryRunner.query(`DROP TABLE "rule_entity"`);
  }
}
